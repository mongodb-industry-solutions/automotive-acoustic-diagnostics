const { vehicle_dataSchema} = require('./schema');
const { appID, realmUser } = require('./config');
const axios = require("axios");
const Realm = require("realm");
const fs = require("fs");

class RealmApp {
	constructor(){
		this.app = new Realm.App({ id: appID,
        //baseUrl: "http://172.13.59.133:80"
		});
		this.self = this;
	}

	async login() {
		await this.app.logIn(Realm.Credentials.emailPassword(realmUser.username, realmUser.password));
		this.realm = await Realm.open({
			schema: [vehicle_dataSchema],
			sync: {
				user: this.app.currentUser,
				flexible: true
			}
		});

		this.realm.subscriptions.update(subscriptions =>  {
			subscriptions.add(this.realm.objects('vehicle_data'));
		});
		this.realm.objects('vehicle_data').addListener(this.processEngineCommands.bind(this));
	}

	processEngineCommands(vehicle_data, changes) {
		console.log(changes)
		console.log(vehicle_data)
		if (vehicle_data[0].LightsOn == true){
			console.log("vehicle on!")
			axios.get('http://localhost:3000/start')
		}
		else if (vehicle_data[0].LightsOn == false){
			//console.log("vehicle off!")
			axios.get('http://localhost:3000/stop')
		} 

		const message = `${vehicle_data[0].Engine_Status}`;
		fs.writeFile('../engine_status.txt', message, (err) => {
			if (err) {
				console.error('Error writing to file', err);
			} else {
				console.log('Engine Status Update in engine_status.txt')
			}
		});
		
	} 	
}

const realmApp = new RealmApp();
	realmApp.login().catch(err => {
	  console.error(err);
})


