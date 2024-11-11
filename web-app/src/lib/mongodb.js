import { MongoClient, ObjectId } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}
if (!process.env.DATABASE_NAME) {
  throw new Error('Invalid/Missing environment variable: "DATABASE_NAME"');
}
if (!process.env.VEHICLE_ID) {
  throw new Error('Invalid/Missing environment variable: "VEHICLE_ID"');
}

// MongoDB client setup
const uri = process.env.MONGODB_URI;
const options = { appName: "automotive-acoustic-diagnostics" };

let client;
let clientPromise;
let vehicleDataChangeStream;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
  global._mongoClientPromise = clientPromise;
} else {
  clientPromise = global._mongoClientPromise;
}

async function getVehicleDataChangeStream() {
  if (!vehicleDataChangeStream) {
    const dbName = process.env.DATABASE_NAME;
    const vehicleId = process.env.VEHICLE_ID;

    const client = await clientPromise;
    const database = client.db(dbName);
    const vehicleDataCollection = database.collection("vehicle_data");

    const pipeline = [ { $match: { 'documentKey._id': new ObjectId(vehicleId) } } ];
    vehicleDataChangeStream = vehicleDataCollection.watch(pipeline);

    vehicleDataChangeStream.on('change', (change) => {
      console.log('Change: ', change);
    });

    vehicleDataChangeStream.on('error', (error) => {
      console.log('Error: ', error);
    });
  }
  return vehicleDataChangeStream;
}

export { clientPromise, getVehicleDataChangeStream };
