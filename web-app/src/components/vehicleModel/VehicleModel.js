"use client";

import { useCallback, useEffect, useState } from 'react'
import Button from '@leafygreen-ui/button';
import styles from "./vehicleModel.module.css";

const VehicleModel = () => {

    const [vehicleData, setVehicleData] = useState({});
    const [sseConnection, setSSEConnection] = useState(null)

    const fetchInitialData = async () => {
        try {
          const response = await fetch('/api/getVehicleData');
          const data = await response.json();
          console.log('Initial data:', data);
          setVehicleData(data);
        } catch (error) {
          console.error('Error fetching initial data:', error);
        }
    };

    const listenToSSEUpdates = useCallback(() => {
        console.log('listenToSSEUpdates func')
        const eventSource = new EventSource('/api/sse')
    
        eventSource.onopen = () => {
          console.log('SSE connection opened.')
          // Save the SSE connection reference in the state
        }
    
        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);
          //console.log('Received SSE Update:', data);
          setVehicleData((prevData) => ({
            ...prevData,
            ...data.updateDescription.updatedFields,
          }));
        }
    
        eventSource.onerror = (event) => {
          console.error('SSE Error:', event);
        }
        setSSEConnection(eventSource);
    
        return eventSource;
      }, []);

    useEffect(() => {
        fetchInitialData();
        const eventSource = listenToSSEUpdates();

        return () => {
            if (eventSource) {
                eventSource.close();
                console.log('SSE connection closed.');
            }
        }
    }, [listenToSSEUpdates]);

    useEffect(() => {
        const handleBeforeUnload = () => {
          if (sseConnection) {
            console.info('Closing SSE connection before unloading the page.')
            sseConnection.close()
          }
        }
    
        window.addEventListener('beforeunload', handleBeforeUnload)
    
        // Clean up the event listener when the component is unmounted
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload)
        }
      }, [sseConnection]);

      const resetBattery = async () => {
        try {
            const response = await fetch(`/api/updateVehicleData`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Battery_Temp: 24,
                    Battery_Current: 100,
                    Battery_Status_OK: true,
                }),
            });
            if (response.ok) {
                console.log('Battery reset successfully');
            } else {
                console.error('Failed to reset battery');
            }
        } catch (error) {
            console.error('Error resetting battery:', error);
        }
    };

  return (
    <div className="vehicle-container">
        <h1>Vehicle: {vehicleData.Vehicle_Name}</h1>
        <img className="vehicle-image" src="/vehicle/new_car.png" alt="Image of vehicle"/>
        <p className="voltage">Battery Temperature: {vehicleData.Battery_Temp}</p>
        <p className="current">Battery Charge: {vehicleData.Battery_Current}</p>
        <p className="ison">Is on: {vehicleData.LightsOn ? "On" : "Off" }</p>
        <img className="engine-image" src={vehicleData.LightsOn ? "/vehicle/engine_on.gif" : "/vehicle/engine_off.png"} alt="Engine Image" />
        <p className="vin">{vehicleData._id}</p>
        <div className="alert-section">
            <img className="alert-image" src={vehicleData.Battery_Status_OK ? "/vehicle/alert_icon_gray.png" : "/vehicle/alert_icon_red.png"} alt="Alert Icon" />
            <h3 className="alert-tooltip"></h3>
        </div>
        <div>{JSON.stringify(vehicleData)}</div>
        <Button onClick={resetBattery}>Reset Battery</Button>
    </div>
  );
};

export default VehicleModel;
