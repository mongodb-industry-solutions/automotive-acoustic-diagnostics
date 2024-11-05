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

def set_lights_on(status):
    global data
    if data:
        # Update the LightsOn field in MongoDB
        coll.update_one({"_id": ObjectId(VEHICLE_ID)}, {"$set": {"LightsOn": status}})
        
        # Update the global vehicle data only after the write is confirmed
        data.LightsOn = status
        print(f"Updated LightsOn status to {status} in MongoDB and vehicle data.")
    else:
        print("Vehicle data is not initialized. Cannot update LightsOn status.")

def monitor_changes():
    global data
    with coll.watch() as change_stream:
        for change in change_stream:
            if change['operationType'] == 'update':
                updated_fields = change['updateDescription']['updatedFields']
                if 'LightsOn' in updated_fields:
                    # Update the global vehicle data LightsOn status
                    new_status = updated_fields['LightsOn']
                    if data and new_status != data.LightsOn:
                        data.LightsOn = new_status
                        print(f"Detected change in LightsOn status: {new_status}")
