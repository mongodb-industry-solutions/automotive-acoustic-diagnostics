import Button from "@leafygreen-ui/button";
import { RadioBoxGroup, RadioBox } from "@leafygreen-ui/radio-box-group";
import styles from "./sampleSimulator.module.css";
import { useEffect, useState, useRef } from "react";

const SampleSimulator = ({ dictionary, vehicleId }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [engineStatus, setEngineStatus] = useState("");
  const [selectedAudio, setSelectedAudio] = useState("");
  const [audioOptions, setAudioOptions] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    const options = dictionary
      .filter((item) => item.rank !== 0)
      .sort((a, b) => a.rank - b.rank);

    setAudioOptions(options);
    // Set the default selected audio to the one with rank 1
    const defaultAudio = options.find((item) => item.rank === 1);
    if (defaultAudio) {
      setSelectedAudio(defaultAudio.audio);
    }
  }, [dictionary]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(async () => {
        const url = `${process.env.NEXT_PUBLIC_DIAGNOSTICS_API_URL}/simulate?_id=${vehicleId}&audio_name=${selectedAudio}`;
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error("Failed to fetch diagnostics");
          }
          const data = await response.json();
          console.log("Diagnostics data:", data);
        } catch (error) {
          console.error("Error fetching diagnostics:", error);
        }
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, selectedAudio, vehicleId]);

  const handleStartSimulation = async () => {
    try {
      const response = await fetch("/api/action/updateOne", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          collection: "vehicle_data",
          filter: { _id: vehicleId },
          update: {
            $set: {
              LightsOn: true,
              Battery_Temp: 24,
              Battery_Current: 100,
              Battery_Status_OK: true,
              Driver_Door_Open: false,
              Hood_Open: false,
              Engine_Status: "Running Normally",
            },
          },
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to start simulation");
      }
      setIsRunning(true);
      setEngineStatus("Running Normally");
      console.log("Simulation started.");
    } catch (error) {
      console.error("Error starting simulation:", error);
    }
  };

  const handleStopSimulation = async () => {
    try {
      const response = await fetch("/api/action/updateOne", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          collection: "vehicle_data",
          filter: { _id: vehicleId },
          update: {
            $set: {
              LightsOn: false,
              Battery_Temp: 24,
              Battery_Current: 100,
              Battery_Status_OK: true,
              Driver_Door_Open: false,
              Hood_Open: false,
              Engine_Status: "Engine Off",
            },
          },
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to stop simulation");
      }
      setIsRunning(false);
      setEngineStatus("Engine Off");
      console.log("Simulation stopped.");
    } catch (error) {
      console.error("Error stopping simulation:", error);
    }
  };

  return (
    <>
      <h1 className={styles.title2}>Simulator</h1>
      <div>
        <Button
          disabled={isRunning}
          onClick={handleStartSimulation}
          variant="primaryOutline"
        >
          Start
        </Button>
        <Button
          disabled={!isRunning}
          onClick={handleStopSimulation}
          variant="dangerOutline"
          className={styles.stopBtn}
        >
          Stop
        </Button>
      </div>
      <div>{engineStatus}</div>
      <RadioBoxGroup
        name="audioOptions"
        default={selectedAudio}
        onChange={(e) => setSelectedAudio(e.target.value)}
      >
        {audioOptions.map((option) => (
          <RadioBox
            key={option.audio}
            value={option.audio}
            disabled={!isRunning}
          >
            {option.audio}
          </RadioBox>
        ))}
      </RadioBoxGroup>
    </>
  );
};

export default SampleSimulator;
