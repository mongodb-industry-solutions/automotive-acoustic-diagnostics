import { useEffect, useState, useRef } from "react";
import { startRecording, stopRecording } from "@/lib/audio";
import Button from "@leafygreen-ui/button";
import Image from "next/image";
import styles from "./sampleAnalyzer.module.css";

const SampleAnalyzer = ({
  dictionary,
  selectedDeviceId,
  recording,
  setRecording,
  vehicleId,
}) => {
  const previousAudioRef = useRef("");
  const [engineStatus, setEngineStatus] = useState("");

  const handleStartDiagnostics = async () => {
    previousAudioRef.current = "";
    try {
      await startRecording(
        selectedDeviceId,
        null,
        setRecording,
        100,
        vehicleId,
        setEngineStatus
      );
    } catch (error) {
      console.error("Error starting diagnostics:", error);
    }
  };

  const handleStopDiagnostics = () => {
    stopRecording();
  };

  return (
    <>
      <h1 className={styles.title2}>Match to reference</h1>
      <div>
        <Button
          disabled={recording}
          onClick={handleStartDiagnostics}
          variant="primaryOutline"
        >
          Start Diagnostics
        </Button>
        <Button
          disabled={!recording}
          onClick={handleStopDiagnostics}
          variant="dangerOutline"
          className={styles.stopBtn}
        >
          Stop Diagnostics
        </Button>
      </div>
      <div>{engineStatus}</div>
    </>
  );
};

export default SampleAnalyzer;
