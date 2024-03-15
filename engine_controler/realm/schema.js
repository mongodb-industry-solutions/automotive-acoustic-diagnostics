const Realm = require("realm");


const vehicle_dataSchema = {
	name: 'vehicle_data',
	properties: {
		_id: 'objectId',
		Battery_Current: 'double?',
		Battery_Status_OK: 'bool?',
		Battery_Temp: 'double?',
		Driver_Door_Open:'bool',
		Driver_id: 'string?',
		Hood_Open: 'bool',
		LightsOn: 'bool',
		Vehicle_Name: 'string?',
	},
	primaryKey: '_id',
};

module.exports = {vehicle_dataSchema}