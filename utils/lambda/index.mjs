import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { MongoClient, ObjectId } from "mongodb";

// Configure Bedrock client
const bedrockClient = new BedrockRuntimeClient({ region: "us-east-1" });
const mongoClient = new MongoClient(process.env.MONGODB_URI);

// Debug-aware logging
const DEBUG_MODE = process.env.DEBUG_MODE === "true";
const log = (...args) => DEBUG_MODE && console.log(...args);

export const handler = async (event) => {
  log("Lambda triggered with event:", JSON.stringify(event, null, 2));

  try {
    const detail = event.detail || {};
    const fullDocument = detail.fullDocument;

    if (!fullDocument) {
      console.error("Missing fullDocument in event detail.");
      throw new Error("Missing fullDocument in event.");
    }

    const vehicleId = fullDocument._id;
    const engineStatus = fullDocument.Engine_Status;
    const batteryTemperature = fullDocument.Battery_Temp;
    const batteryCurrent = fullDocument.Battery_Current;

    log("Extracted vehicle data:", {
      vehicleId,
      engineStatus,
      batteryTemperature,
      batteryCurrent,
    });

    const prompt = `Create a comprehensive status report for this engine based on a 4-cilinder engine. The report should include a brief description of the issue and a brief explanation on how to fix the issue, reference a specific page of the manual, if you don't know it, just say it's in page 42. Keep it short, the report should be under 280 characters. Start the report with the title Engine Acoustic-Based Status. This is the data you have to build the report: Abnormal ${engineStatus}, Battery Temperature: ${batteryTemperature} Degrees, Battery Percentage: ${batteryCurrent}.`;

    const command = new InvokeModelCommand({
      modelId: "amazon.titan-text-express-v1",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        inputText: prompt,
        textGenerationConfig: {
          maxTokenCount: 8192,
          stopSequences: [],
          temperature: 0,
          topP: 1,
        },
      }),
    });

    log("Sending request to Bedrock...");
    const response = await bedrockClient.send(command);
    const decodedBody = new TextDecoder().decode(response.body);
    log("Raw response from Bedrock:", decodedBody);

    const parsed = JSON.parse(decodedBody);
    parsed.vehicle_id = ObjectId.createFromHexString(vehicleId);

    log("Parsed Bedrock response:", parsed);

    await mongoClient.connect();
    const db = mongoClient.db("automotive_acoustic_diagnostics");
    const collection = db.collection("reports");

    log("Inserting document into reports collection...");
    const insertResult = await collection.insertOne(parsed);
    log("Insert result:", insertResult);

    console.log(
      `Report inserted successfully for vehicle ${vehicleId.$oid || vehicleId}`
    );
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Report inserted", vehicleId }),
    };
  } catch (error) {
    console.error("Error in Lambda:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  } finally {
    await mongoClient.close();
    log("Closed MongoDB connection.");
  }
};
