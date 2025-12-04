import { MongoClient } from "mongodb";
import { EJSON } from "bson";

const options = { appName: "automotive-acoustic-diagnostics" };

const changeStreams = new Map();

function getClientPromise() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
  }

  const uri = process.env.MONGODB_URI;

  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    const clientPromise = client.connect();
    global._mongoClientPromise = clientPromise;
  }

  return global._mongoClientPromise;
}

async function getChangeStream(filter, key) {
  if (!process.env.DATABASE_NAME) {
    throw new Error('Invalid/Missing environment variable: "DATABASE_NAME"');
  }
  const dbName = process.env.DATABASE_NAME;

  if (!changeStreams.has(key)) {
    const client = await getClientPromise();
    const db = client.db(dbName);

    const filterEJSON = EJSON.parse(JSON.stringify(filter));

    const pipeline = [{ $match: filterEJSON }];
    const changeStream = db.watch(pipeline);

    changeStream.on("change", (change) => {
      //console.log("Change: ", change);
    });

    changeStream.on("error", (error) => {
      console.log("Error: ", error);
    });

    changeStreams.set(key, changeStream);
  }
  return changeStreams.get(key);
}

export { getClientPromise as clientPromise, getChangeStream };
