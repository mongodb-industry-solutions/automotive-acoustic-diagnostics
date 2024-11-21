"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import Button from "@leafygreen-ui/button";
import { Select, Option } from "@leafygreen-ui/select";
import Image from "next/image";
import styles from "./vehicleModule.module.css";
import { v4 as uuidv4 } from "uuid";

const VehicleModule = () => {
  const [vehicles, setVehicles] = useState([]);
  const [vehicleData, setVehicleData] = useState(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const sseConnection = useRef(null);

  const collection = "vehicle_data";
  const sessionId = useRef(uuidv4()); //unique id for this session

  const listenToSSEUpdates = useCallback(() => {
    if (!selectedVehicleId) return;

    console.log(
      "Listening to SSE updates for collection " + collection + " and vehicle ",
      selectedVehicleId
    );
    const eventSource = new EventSource(
      "/api/sse?sessionId=" +
      sessionId +
      "colName=" +
      collection +
      "&_id=" +
      selectedVehicleId
    );

    eventSource.onopen = () => {
      console.log("SSE connection opened.");
      // Save the SSE connection reference in the state
    };

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      //console.log('Received SSE Update:', data);
      setVehicleData((prevData) => ({
        ...prevData,
        ...data.updateDescription.updatedFields,
      }));
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
  }, [selectedVehicleId]);

  useEffect(() => {
    fetchVehicles();
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

  const fetchVehicles = async () => {
    try {
      const response = await fetch("/api/action/find", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          collection: collection,
          filter: {}, // No filter to get all vehicles
          projection: { Vehicle_Name: 1 }, // Only get Vehicle_Name
        }),
      });
      const data = await response.json();
      setVehicles(data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  const fetchVehicleData = async (vehicleId) => {
    try {
      const response = await fetch("/api/action/findOne", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          collection: collection,
          filter: { _id: vehicleId },
        }),
      });
      const data = await response.json();
      setVehicleData(data);
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
    }
  };

  const handleVehicleChange = (event) => {
    const vehicleId = event;
    setSelectedVehicleId(vehicleId);
    fetchVehicleData(vehicleId);
  };

  const resetBattery = async () => {
    try {
      const response = await fetch("/api/action/updateOne", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          collection: collection,
          filter: { _id: vehicleData._id },
          update: {
            $set: {
              Battery_Temp: 24,
              Battery_Current: 100,
              Battery_Status_OK: true,
            },
          },
          upsert: false,
        }),
      });
      if (response.ok) {
        console.log("Battery reset successfully");
      } else {
        console.error("Failed to reset battery");
      }
    } catch (error) {
      console.error("Error resetting battery:", error);
    }
  };

  return (
    <div className="vehicle-container">
      <Select
        placeholder="Select a vehicle"
        onChange={handleVehicleChange}
        value={selectedVehicleId || ""}
        aria-label="Vehicle Select"
      >
        {vehicles.map((vehicle) => (
          <Option key={vehicle._id} value={vehicle._id}>
            {vehicle.Vehicle_Name}
          </Option>
        ))}
      </Select>
      {vehicleData && (
        <>
          <h1>Vehicle: {vehicleData.Vehicle_Name}</h1>
          <Image
            className="vehicle-image"
            src="/vehicle/new_car.png"
            alt="Image of vehicle"
            height={90}
            width={200}
          />
          <p className="voltage">
            Battery Temperature: {vehicleData.Battery_Temp} °C
          </p>
          <p className="current">
            Battery Charge: {vehicleData.Battery_Current}
          </p>
          <p className="ison">Engine Status: {vehicleData.LightsOn ? "On" : "Off"}</p>
          <Image
            className="engine-image"
            src={
              vehicleData.LightsOn
                ? "/vehicle/engine_on.gif"
                : "/vehicle/engine_off.png"
            }
            alt="Engine Image"
            height={40}
            width={50}
          />
          <p className="vin">Vehicle ID: {vehicleData._id}</p>
          <div className={styles.alertSection}>
            <p>Active Alerts:</p>
            <Image
              className={styles.alertImg}
              src={
                vehicleData.Battery_Status_OK
                  ? "/vehicle/alert_icon_gray.png"
                  : "/vehicle/alert_icon_red.png"
              }
              alt="Alert Icon"
              height={20}
              width={20}
            />

            <p>
              {
                vehicleData.Battery_Status_OK
                  ? "None"
                  : "Battery Issue"
              }
            </p>
            <h3 className="alert-tooltip"></h3>
          </div>
          <div>{JSON.stringify(vehicleData)}</div>
          <Button className={styles.resetBtn} onClick={resetBattery}>Reset Battery</Button>
        </>
      )}
    </div>
  );
};

export default VehicleModule;
