"use client";

import { useCallback, useEffect, useState } from 'react'
import styles from "./vehicleModel.module.css";

const VehicleModel = () => {

    const [vehicleData, setVehicleData] = useState({});
    const [sseConnection, setSSEConnection] = useState(null)

    const listenToSSEUpdates = useCallback(() => {
        console.log('listenToSSEUpdates func')
        const eventSource = new EventSource('/api/sse')
    
        eventSource.onopen = () => {
          console.log('SSE connection opened.')
          // Save the SSE connection reference in the state
        }
    
        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log('Received SSE Update:', data);
          // Update your UI or do other processing with the received data
        }
    
        eventSource.onerror = (event) => {
          console.error('SSE Error:', event);
          // Handle the SSE error here
        }
        setSSEConnection(eventSource);
    
        return eventSource;
      }, []);

    useEffect(() => {
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

  return (
    <div className="vehicle-container">
        <h1></h1>
        <img className="vehicle-image" src="/vehicle/new_car.png" alt="Image of vehicle"/>
        <p className="voltage">Voltage: </p>
        <p className="current">Current: </p>
        <p className="ison">is on</p>
        <img className="engine-image" src="/vehicle/engine_off.png" alt="Engine GIF" />
        <p className="vin"></p>
        <div className="alert-section">
            <img className="alert-image" src="/vehicle/alert_icon_gray.png" alt="Alert Icon" />
            <h3 className="alert-tooltip"></h3>
        </div>
    </div>
  );
};

export default VehicleModel;
