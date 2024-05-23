const { version, Chip, Line } = require("node-libgpiod");
const express = require("express");
const Realm = require("realm");
const { appID, realmUser } = require('./realm/config');
const { vehicle_dataSchema} = require('./realm/schema');


const app = express();

app.chip = new Chip(4); // using Chip(4) as explained here: https://forums.raspberrypi.com/viewtopic.php?t=364182
app.line16 = app.chip.getLine(16)

app.line16.requestOutputMode()
app.line16.setValue(1);


// Realm Setup
const realmApp = new Realm.App({id: appID,
//baseUrl: "http://172.13.59.133:80"
})
let realm;


async function login() {
	const credentials = Realm.Credentials.emailPassword(realmUser.username, realmUser.password);
	const user = await realmApp.logIn(credentials)
	realm = await Realm.open({
		schema: [vehicle_dataSchema],
		sync: {
			user: user,
			flexible: true
		}
	});
	console.log(realm.path)

	await realm.subscriptions.update(subscriptions =>  {
			subscriptions.add(realm.objects('vehicle_data'));
		});
}

async function updateVehicleData(LightStatus){
	realm.write(() => {
		let vehicleData = realm.objects("vehicle_data")[0]; //this assumes there only one vehicle object therefore [0]
		console.log(LightStatus)
		vehicleData.LightsOn = LightStatus;

	})
}

app.get("/stop", async function(req, res){
	//console.log(app.line4.getValue())
	//console.log(app.line4.getLineOffset())
	//console.log(app.line4.getLineName())
	//console.log(app.line4.getLineConsumer())
		
	if (realm.objects("vehicle_data")[0].LightsOn == false){
			console.log("Engine Off")
		}
	else if (realm.objects("vehicle_data")[0].LightsOn == true){
			await updateVehicleData(false);
		}
	app.line16.setValue(1);
	res.send("Stop")

})

app.get("/start", async function(req, res){					

	if (realm.objects("vehicle_data")[0].LightsOn == true){
			console.log("Engine On")
		}
	else if (realm.objects("vehicle_data")[0].LightsOn == false){
			await updateVehicleData(true);
		}	
	app.line16.setValue(0);
	res.send("Start")


})

app.listen(3000, () => {
	console.log("Server running on port 3000")
	login().catch(err => {
		console.error("\nFailed to log in to Realm", err);
		process.exit(0)
	})
})

process.on("SIGINT", async () => {

	await updateVehicleData(false)
	app.line16.setValue(1);
	console.log("\nClosing Server, stopping Engine!")
	process.exit(0)
})

