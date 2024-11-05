# database.py
import os
from pymongo import MongoClient
from vehicle_model import Vehicle
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
VEHICLE_ID = os.getenv("VEHICLE_ID")

client = MongoClient(MONGODB_URI)
db = client.get_database("connected_vehicle")
vehicles_collection = db.get_collection("vehicle_data")

# Global vehicle instance
vehicle = None

def initial_sync():
    global vehicle
    # Fetch the vehicle data using VEHICLE_ID
    vehicle_data = vehicles_collection.find_one({"_id": VEHICLE_ID})
    if vehicle_data:
        vehicle = Vehicle(vehicle_data)
    else:
        print("Vehicle data not found.")
