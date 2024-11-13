"use client";
import styles from "./page.module.css";
import AudioDevicePicker from "@/components/audioDevicePicker/AudioDevicePicker";
import SampleRecorder from "@/components/sampleRecorder/SampleRecorder";
import DiagnosticsModule from "@/components/diagnosticsModule/DiagnosticsModule";
import { useState } from "react";
import Button from "@leafygreen-ui/button";
import Stepper, { Step } from "@leafygreen-ui/stepper";
import { ToastProvider } from '@leafygreen-ui/toast';

export default function AcousticDiagnostics() {
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const dictionary = [{audio: 'Normal', rank: 1}];

  const resetTraining = () => {
    setCurrentIndex(0);
  };

  return (
    <ToastProvider>
    <div className={styles.page}>

      <AudioDevicePicker deviceId={selectedDeviceId} setDeviceId={setSelectedDeviceId} recording={recording} />

      <Button className={styles.resetBtn} disabled={recording} onClick={resetTraining}>Reset</Button>

      {currentIndex < dictionary.length ?
          (
              <SampleRecorder
                  dictionary={dictionary}
                  selectedDeviceId={selectedDeviceId}
                  currentIndex={currentIndex}
                  setCurrentIndex={setCurrentIndex}
                  recording={recording}
                  setRecording={setRecording}
              />
          ) : (
              <DiagnosticsModule
                  dictionary={dictionary}
                  selectedDeviceId={selectedDeviceId}
                  recording={recording}
                  setRecording={setRecording}
              />
          )
      }

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
    </ToastProvider>
  );
}
