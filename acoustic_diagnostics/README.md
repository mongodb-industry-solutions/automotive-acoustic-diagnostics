# Acoustic-based Diagnostics using MongoDB Vector Search
Demonstration of MongoDB's Vector Search capabilities for anomaly detection through sound input. This demo enables real-time diagnosis by analyzing the emitted audio, allowing us to diagnose its condition—whether it's operating normally, stopped, or experiencing any issues.

## 1. MongoDB Atlas Connection
Create a file called `.env` in the main directory alongside the `add_audio.py` file and add your atlas connection string, in the following format:  

`MONGO_CONNECTION_STRING="mongodb+srv://connectionstringfromatlas"`

## 2. Install Python Modules

Install the required python modules.

`pip install pyaudio`

`pip install numpy`

`pip install pymongo`

`pip install librosa`

`pip install panns_inference`

`pip install torch`

`pip install python-dotenv`

`pip install certifi`

## 3. Record Audio Files

Run `python add_audio.py`

Select the audio input by typing the relevant number and then press enter. Record each sound in sequence.

> [!TIP]
> We recommend using an external microphone and placing it very close to the fan or audio source.

## 4. Create a Search Index

Go to MongoDB Atlas and create an Atlas Search Index in the **audio** database **sounds** collection and using the content of `searchindex.json`

```
{
    "mappings": {
      "dynamic": true,
      "fields": {
        "emb": {
          "dimensions": 2048,
          "similarity": "cosine",
          "type": "knnVector"
        }
      }
    }
  }
```
## 5. Query the Database

Run `python live_query.py` and place your microphone next to the fan.

