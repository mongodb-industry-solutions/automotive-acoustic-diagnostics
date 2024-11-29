# vehicle_model.py
class Vehicle:
    def __init__(self, data):
        self._id = data.get('_id')
        self.Battery_Current = data.get('Battery_Current')
        self.Battery_Status_OK = data.get('Battery_Status_OK')
        self.Battery_Temp = data.get('Battery_Temp')
        self.Driver_Door_Open = data.get('Driver_Door_Open')
        self.Driver_id = data.get('Driver_id')
        self.Hood_Open = data.get('Hood_Open')
        self.LightsOn = data.get('LightsOn')
        self.Vehicle_Name = data.get('Vehicle_Name')
        self.Engine_Status = data.get('Engine_Status')
