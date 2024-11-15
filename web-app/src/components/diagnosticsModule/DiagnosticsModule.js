"use client";

import { useState, useEffect } from "react";
import AudioDevicePicker from "@/components/audioDevicePicker/AudioDevicePicker";
import SampleRecorder from "@/components/sampleRecorder/SampleRecorder";
import SampleAnalyzer from "@/components/sampleAnalyzer/SampleAnalyzer";
import Button from "@leafygreen-ui/button";
import Stepper, { Step } from "@leafygreen-ui/stepper";
import styles from "./diagnosticsModule.module.css";

const DiagnosticsModule = ({}) => {
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [dictionary, setDictionary] = useState([]);

  const vehicleId = "658876fde27a68ff985cdb4d";

  useEffect(() => {
    fetchDictionary();
  }, []);

  const fetchDictionary = async () => {
    try {
      const response = await fetch("/api/action/find", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          collection: "dictionary",
          filter: {},
          sort: { rank: 1 },
        }),
      });
      const data = await response.json();
      setDictionary(data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  const resetTraining = () => {
    setCurrentIndex(0);
  };
  return (
    <>
      <div className={styles.page}>
        <AudioDevicePicker
          deviceId={selectedDeviceId}
          setDeviceId={setSelectedDeviceId}
          recording={recording}
        />

        <Button
          className={styles.resetBtn}
          disabled={recording}
          onClick={resetTraining}
        >
          Reset
        </Button>

        {dictionary.length == 0 || currentIndex < dictionary.length ? (
          <SampleRecorder
            dictionary={dictionary}
            selectedDeviceId={selectedDeviceId}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            recording={recording}
            setRecording={setRecording}
          />
        ) : (
          <SampleAnalyzer
            dictionary={dictionary}
            selectedDeviceId={selectedDeviceId}
            recording={recording}
            setRecording={setRecording}
            vehicleId={vehicleId}
          />
        )}

        <Stepper
          currentStep={currentIndex}
          className={styles.stepper}
          maxDisplayedSteps={5}
        >
          {dictionary.map((item, index) => (
            <Step key={index}>{item.audio}</Step>
          ))}
        </Stepper>
      </div>
    </>
  );
};

export default DiagnosticsModule;
