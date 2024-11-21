from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import librosa
from panns_inference import AudioTagging
import io
from pydub import AudioSegment
from pymongo import MongoClient
import os
import certifi
from dotenv import load_dotenv
from datetime import datetime
from bson.objectid import ObjectId
import json

load_dotenv()

app = FastAPI()

connection_string = os.getenv('MONGODB_URI')
database_name = os.getenv('DATABASE_NAME')

# Initialize the AudioTagging model
model = AudioTagging(checkpoint_path=None, device='cuda')

# Deine MongoDB client
client = MongoClient(connection_string, tlsCAFile=certifi.where())
db = client[database_name]
mongodb_sounds_collection = db['sounds']
mongodb_results_collection = db['results']
mongodb_vehicle_data_collection = db['vehicle_data']

# Function to normalize a vector
def normalize(v):
    norm = np.linalg.norm(v)
    if norm == 0:
        return v
    return v / norm

# Function to get an embedding of an audio file
def get_embedding(audio_file):
    # get audio data
    audio_bytes = io.BytesIO(audio_file)
    audio_segment = AudioSegment.from_file(audio_bytes, format="webm")
    
    wav_bytes = io.BytesIO()
    audio_segment.export(wav_bytes, format="wav")
    wav_bytes.seek(0)

    # Save converted file to verify
    #timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    #with open(f"recording_{timestamp}.wav", "wb") as f:
    #    f.write(wav_bytes.read())
    #wav_bytes.seek(0)
    
    audio_data, _ = librosa.load(wav_bytes, sr=44100, dtype=np.float32)

    # generate embedding
    query_audio = audio_data[None, :]
    _, emb = model.inference(query_audio)
    normalized_v = normalize(emb[0])

    return normalized_v

def insert_mongo_sounds(audio_name,embedding):
    # Create the results document
    entry = {"audio":audio_name,"emb":embedding}

    try:
        # Insert the document into the MongoDB collection
        mongodb_sounds_collection.insert_one(entry)
    except Exception as e:
        print(f"Error inserting document: {e}")
        return False
    return True

def insert_mongo_results(results, status, _id):
    # Create the results document
    entry = {"sensor":"Microphone 1","data_time":datetime.now(),"results":results}

    # Determine the Battery_Status_OK based on the status
    if status in ["Soft Material Hit", "Metallic Hit"]:
        battery_status_ok = False
    else:
        battery_status_ok = True

    try:
        # Insert results
        mongodb_results_collection.insert_one(entry)

        # Update engine status
        mongodb_vehicle_data_collection.update_one({"_id": ObjectId(_id)}, {"$set": {"Engine_Status":status, "Battery_Status_OK": battery_status_ok}})
    except Exception as e:
        print(f"Error inserting document: {e}")
        return False
    return True

def knnbeta_search(embedding):
    # Create the query vector
    query_vector = embedding.tolist()

    # Create the search query
    search_query = [
        {
            "$search": {
                "knnBeta": {
                    "vector": query_vector,
                    "path": "emb",
                    "k": 3
                }
            }
        },
        {
            "$project": {
            "_id": 0,
            "audio": 1,
            #"image": 1,
            "audio_file": 1,
            "score": { "$meta": "searchScore" }
            }
        }
    ]

    # Perform the search query
    results = mongodb_sounds_collection.aggregate(search_query)

    return results

def weighted_average(json_results):
    audio_scores = {}
    
    for result in json_results:
        audio = result['audio']
        score = result['score']
        
        if audio in audio_scores:
            audio_scores[audio].append(score)
        else:
            audio_scores[audio] = [score]
    
    status_pred = max(audio_scores, key=lambda audio: sum(audio_scores[audio]) / len(audio_scores[audio]))
    
    return status_pred


# CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from this origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/train")
async def train(file: UploadFile = File(...), audio_name: str = None):
    if file.content_type != "audio/webm":
        return JSONResponse(status_code=400, content={"message": "Invalid file type. Please upload a WebM file."})

    audio_file = await file.read()
    emb = get_embedding(audio_file)

    insert_mongo_sounds(audio_name, emb.tolist())
    
    return {"success": True}

@app.post("/diagnose")
async def diagnose(file: UploadFile = File(...), _id: str = None):
    if file.content_type != "audio/webm":
        return JSONResponse(status_code=400, content={"message": "Invalid file type. Please upload a WebM file."})

    audio_file = await file.read()
    emb = get_embedding(audio_file)
    
    results = knnbeta_search(emb)
    json_results = list(results)
    status_pred = weighted_average(json_results)

    insert_mongo_results(json_results, status_pred, _id)
    
    return {"success": True, "engine_status": status_pred}

@app.get("/simulate")
async def simulate(_id: str = None, audio_name: str = None):
    if not audio_name:
        return JSONResponse(status_code=400, content={"message": "audio_name is required."})
    
    file_name = audio_name.lower().replace(" ", "_")
    file_path = f"data/{file_name}.json"
    
    if not os.path.exists(file_path):
        return JSONResponse(status_code=404, content={"message": f"File {file_name}.json not found."})
    
    try:
        with open(file_path, 'r') as file:
            file_content = json.load(file)
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": f"Error reading file: {e}"})
    
    json_results = file_content
    status_pred = audio_name

    insert_mongo_results(json_results, status_pred, _id)
    
    return {"success": True, "engine_status": status_pred}

# To run the FastAPI server, use the command: uvicorn main:app --reload