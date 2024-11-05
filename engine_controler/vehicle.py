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

def set_engine_status(status):
    global data
    if data:
        # Update the Engine_Status field in MongoDB
        coll.update_one({"_id": ObjectId(VEHICLE_ID)}, {"$set": {"Engine_Status": status}})
        
        # Update the global vehicle data only after the write is confirmed
        data.Engine_Status = status
        print(f"Updated Engine_Status to {status} in MongoDB and vehicle data.")
    else:
        print("Vehicle data is not initialized. Cannot update Engine_Status.")

def monitor_changes():
    global data
    with coll.watch() as change_stream:
        for change in change_stream:
            if change['operationType'] == 'update':
                updated_fields = change['updateDescription']['updatedFields']
                
                for field, new_value in updated_fields.items():
                    if hasattr(data, field):
                        current_value = getattr(data, field)
                        if current_value != new_value:
                            setattr(data, field, new_value)
                            print(f"Detected change in {field}: {new_value}")
