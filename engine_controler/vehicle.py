import os
from pymongo import MongoClient
from bson import ObjectId
from vehicle_model import Vehicle
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
VEHICLE_ID = os.getenv("VEHICLE_ID")

client = MongoClient(MONGODB_URI)
db = client["connected_vehicle"]
coll = db["vehicle_data"]

# Global vehicle instance
data = None

def initial_sync():
    global data
    # Fetch the vehicle data using VEHICLE_ID
    vehicle_data = coll.find_one({"_id": ObjectId(VEHICLE_ID)})
    if vehicle_data:
        data = Vehicle(vehicle_data)
    else:
        print("Vehicle data not found.")
