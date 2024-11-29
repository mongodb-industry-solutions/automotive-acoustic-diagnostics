# Web portal UI

## Setup MongoDB Atlas Charts

1. In Atlas, go to Charts and click the down arrow next to "Add Dashboard", then click "Import Dashboard".
2. Select the file [`Acoustic Vehicle Diagnosis Dashboard.charts`](../utils/charts/Acoustic%20Vehicle%20Diagnosis%20Dashboard.charts) from the `utils/charts` folder and click "Next".
3. Click on the pencil icon and ensure the database is correctly assigned to the one previously created.
4. Click "Save", and then "Save" again.
5. Click the new dashboard to see analytics on the sounds that are being detected by the microphone.

> [!Note]
> You will need the base URL and dashboard IDs to set up your environment variables later (`NEXT_PUBLIC_CHARTS_BASE_URL`, `NEXT_PUBLIC_CHARTS_DASHBOARD_ID`).

## Install the Node dependencies

To install the node dependencies run the following command in your terminal:

```
npm install
```

## Run the web portal

Update the environment variables, you can create a `.env` file from the `EXAMPLE.env` file provided.

```
cp EXAMPLE.env .env
```

Once you have updated the environment variables with your own values, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

Great! You have now completed the setup and should have a fully functional demo of the web portal. If you would like to further extend the demo, there is an optional last step that allows you to control the engine and digital twin from your phone. If you are interested, please navigate to [Step 6 - Control your vehicle from a mobile device](../ios-app/README.md) for more details.
