import { useEffect, useState } from "react";
import { startRecording, deletePreviousSamples } from "@/lib/audio";
import { useToast } from "@leafygreen-ui/toast";
import Button from "@leafygreen-ui/button";
import { Option, Select } from "@leafygreen-ui/select";
import styles from "./sampleRecorder.module.css";

const SampleRecorder = ({
  dictionary,
  selectedDeviceId,
  currentIndex,
  setCurrentIndex,
  recording,
  setRecording,
}) => {
  const [numSamples, setNumSamples] = useState("3"); //Number of samples to record per class

  useEffect(() => {
    if (currentIndex >= dictionary.length) {
      console.log("All recordings are done.");
    }
  }, [currentIndex, dictionary.length]);

  const handleStartRecording = async () => {
    const audioName =
      currentIndex < dictionary.length ? dictionary[currentIndex].audio : null;
    try {
      await deletePreviousSamples(audioName);
      await startRecording(
        selectedDeviceId,
        audioName,
        setRecording,
        parseInt(numSamples),
        null,
        null
      );
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const skipTraining = () => {
    setCurrentIndex(dictionary.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + 1, dictionary.length - 1)
    );
  };

  return (
    <>
      <div>
        <h1 className={styles.title2}>Record audio references</h1>
        <div className={styles.sampleSection}>
          <p htmlFor="numSamples">Number of training samples:</p>
          <Select
            id="numSamples"
            name="numSamples"
            aria-label="Number of training samples"
            disabled={currentIndex != 0}
            value={numSamples}
            placeholder=""
            onChange={(value) => setNumSamples(value)}
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <Option key={value} value={value.toString()}>
                {value}
              </Option>
            ))}
          </Select>
        </div>

        <h2>Current Audio: {dictionary[currentIndex]?.audio}</h2>

        <Button
          disabled={recording}
          onClick={handleStartRecording}
          variant="primaryOutline"
        >
          Start Recording
        </Button>
        <Button
          disabled={recording}
          onClick={skipTraining}
          variant="dangerOutline"
          className={styles.skipBtn}
        >
          Skip Training
        </Button>
        <Button
          disabled={currentIndex === 0}
          onClick={handlePrevious}
          variant="default"
        >
          Previous
        </Button>
        <Button
          disabled={currentIndex === dictionary.length - 1}
          onClick={handleNext}
          variant="default"
        >
          Next
        </Button>
        {/*audioBlob && <audio controls src={URL.createObjectURL(audioBlob)} />*/}
      </div>
    </>
  );
};

export default SampleRecorder;
