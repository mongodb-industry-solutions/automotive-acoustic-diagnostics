"use client";

import styles from "./analyticsDashboard.module.css";
import { useState, useEffect, useRef, useCallback } from "react";
import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";
import { v4 as uuidv4 } from "uuid";
import { ObjectId } from "bson";

const AnalyticsDashboard = ({ vehicleId }) => {
  const [rendered, setRendered] = useState(false);
  const dashboardDiv = useRef(null);
  const sseConnection = useRef(null);
  const sessionId = useRef(uuidv4());

  const baseUrl = process.env.NEXT_PUBLIC_CHARTS_BASE_URL;
  const dashboardId = process.env.NEXT_PUBLIC_CHARTS_DASHBOARD_ID;

  const sdk = new ChartsEmbedSDK({ baseUrl: baseUrl });

  const [dashboard] = useState(
    sdk.createDashboard({
      dashboardId: dashboardId,
      widthMode: "scale",
      filter: {},
      heightMode: "scale",
      background: "#fff",
    })
  );

  const listenToSSEUpdates = useCallback(() => {
    const collection = "results";
    console.log("Listening to SSE updates for collection " + collection);
    const eventSource = new EventSource(
      "/api/sse?sessionId=" + sessionId.current + "&colName=" + collection
    );
    eventSource.onopen = () => {
      console.log("SSE connection opened - dashboard.");
    };
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.fullDocument.vehicle_id === vehicleId) {
        console.log("Received SSE Update:", data);
        // Refresh the dashboard
        dashboard.refresh();
      }
    };
    eventSource.onerror = (event) => {
      console.error("SSE Error:", event);
    };
    // Close the previous connection if it exists
    if (sseConnection.current) {
      sseConnection.current.close();
      console.log("Previous SSE connection closed - dashboard.");
    }
    sseConnection.current = eventSource;
    return eventSource;
  }, [dashboard, vehicleId]);

  useEffect(() => {
    if (!rendered) {
      dashboard
        .render(dashboardDiv.current)
        .then(() => setRendered(true))
        .catch((err) => console.log("Error during Charts rendering.", err));
    }

    if (dashboardDiv.current) {
      dashboardDiv.current.style.height = "600px";
    }

    const eventSource = listenToSSEUpdates();
    return () => {
      if (eventSource) {
        eventSource.close();
        console.log("SSE connection closed.");
      }
    };
  }, [dashboard, listenToSSEUpdates]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (sseConnection.current) {
        console.info("Closing SSE connection before unloading the page.");
        sseConnection.current.close();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [sseConnection]);

  useEffect(() => {
    if (vehicleId) {
      dashboard
        .setFilter({
          $or: [
            { _id: ObjectId.createFromHexString(vehicleId) },
            { vehicle_id: ObjectId.createFromHexString(vehicleId) },
          ],
        })
        .catch((err) => console.log("Error adding filter to dashboard.", err));
    }
  }, [vehicleId, dashboard]);

  return (
    <>
      <div className={styles.dashboard} ref={dashboardDiv} />
    </>
  );
};

export default AnalyticsDashboard;
