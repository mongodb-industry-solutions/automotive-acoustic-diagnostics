exports = async function (changeEvent) {
  const {
    BedrockRuntimeClient,
    InvokeModelCommand,
  } = require("@aws-sdk/client-bedrock-runtime");
  const text_decoding = require("text-decoding");

  const clusterName = "<your-cluster-name>";
  const dbName = "automotive_acoustic_diagnostics";
  const colName = "reports";

  var config = {
    region: "eu-central-1",
    credentials: {
      accessKeyId: context.values.get(`AWS_ACCESS_KEY`),
      secretAccessKey: context.values.get(`AWS_ACCESS_SECRET_VALUE`),
    },
  };

  const vehicleId = changeEvent.fullDocument._id;
  const engineStatus = changeEvent.fullDocument.Engine_Status;
  const batteryTemperature = changeEvent.fullDocument.Battery_Temp;
  const batteryCurrent = changeEvent.fullDocument.Battery_Current;

  const input = {
    modelId: "amazon.titan-text-express-v1",
    contentType: "application/json",
    accept: "application/json",
    body: `{\"inputText\":\"Engine Acoustic-Based Status: Abnormal ${engineStatus}, Battery Temperature: ${batteryTemperature} Degrees, Battery Percentage: ${batteryCurrent}, Create a comprehensive status report for this engine based on a 4-cilinder engnine. Start with the report here:\",\"textGenerationConfig\":{\"maxTokenCount\":8192,\"stopSequences\":[],\"temperature\":0,\"topP\":1}}`,
  };

  try {
    const client = new BedrockRuntimeClient(config);
    const command = new InvokeModelCommand(input);
    const data = await client.send(command);
    let response = JSON.parse(
      new text_decoding.TextDecoder().decode(data.body)
    );
    response.vehicle_id = vehicleId;

    const reportsCollection = context.services
      .get(clusterName)
      .db(dbName)
      .collection(colName);

    const result = await reportsCollection.insertOne(response);

    console.log("Report generated.");

    return;
  } catch (err) {
    console.log("error performing mongodb write: ", err.message);
  }
};
