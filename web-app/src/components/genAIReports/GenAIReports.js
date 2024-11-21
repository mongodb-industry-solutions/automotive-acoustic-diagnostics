"use client";

import styles from "./genAIReports.module.css";
import { useState, useEffect, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

const GenAIReports = ({}) => {
  const [reports, setReports] = useState([]);
  const sseConnection = useRef(null);
  const sessionId = useRef(uuidv4());

  const listenToSSEUpdates = useCallback(() => {
    const collection = "reports";
    console.log("Listening to SSE updates for collection " + collection);
    const eventSource = new EventSource(
      "/api/sse?sessionId=" + sessionId.current + "&colName=" + collection
    );
    eventSource.onopen = () => {
      console.log("SSE connection opened.");
    };
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received SSE Update: New report");
      const newReport = data.fullDocument.results[0]?.outputText;
      setReports((prevReports) => [...prevReports, newReport]);
    };
    eventSource.onerror = (event) => {
      console.error("SSE Error:", event);
    };
    // Close the previous connection if it exists
    if (sseConnection.current) {
      sseConnection.current.close();
      console.log("Previous SSE connection closed.");
    }
    sseConnection.current = eventSource;
    return eventSource;
  }, []);

  useEffect(() => {
    const eventSource = listenToSSEUpdates();
    return () => {
      if (eventSource) {
        eventSource.close();
        console.log("SSE connection closed.");
      }
    };
  }, [listenToSSEUpdates]);

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

  return (
    <>
      <h2>GenAI Reports</h2>
      <div className={styles.reportsContainer}>
        {reports.map((report, index) => (
          <div key={index} className={styles.reportBox}>
            {report}
          </div>
        ))}
      </div>
    </>
  );
};

export default GenAIReports;
