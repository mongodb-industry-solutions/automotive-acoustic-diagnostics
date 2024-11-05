import os
from pymongo import MongoClient
from bson import ObjectId
from vehicle_model import Vehicle
from time import sleep
import random
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
        
        # Update the global vehicle data
        data.LightsOn = status
        print(f"Updated LightsOn to {status}.")
    else:
        print("Vehicle data is not initialized. Cannot update LightsOn.")

def set_engine_status(status):
    global data
    if data:
        # Update the Engine_Status field in MongoDB
        coll.update_one({"_id": ObjectId(VEHICLE_ID)}, {"$set": {"Engine_Status": status}})
        
        # Update the global vehicle data
        data.Engine_Status = status
        print(f"Updated Engine_Status to {status}.")
    else:
        print("Vehicle data is not initialized. Cannot update Engine_Status.")

def set_telemetry(current_change, temperature_change):
    global data
    if data:
        # Calculate the new telemetry values
        new_current = max(data.Battery_Current - current_change, 0)
        new_temp = data.Battery_Temp + temperature_change

        # Update MongoDB
        coll.update_one(
            {"_id": ObjectId(VEHICLE_ID)},
            {
                "$set": {
                    "Battery_Current": new_current,
                    "Battery_Temp": new_temp
                }
            }
        )

        # Update local vehicle data only
        data.Battery_Current = new_current
        data.Battery_Temp = new_temp
        print(f"Telemetry updated - Battery_Current: {new_current}, Battery_Temp: {new_temp}")
    else:
        print("Vehicle data is not initialized. Cannot update telemetry.")

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

def simulate_telemetry():
    global data
    
    while True:
        # Only update telemetry if LightsOn is True
        if data and data.LightsOn:
            
            current_change = random.randint(0, 5)
            temperature_change = random.randint(-2, 3)

            set_telemetry(current_change, temperature_change)

        sleep(2)
