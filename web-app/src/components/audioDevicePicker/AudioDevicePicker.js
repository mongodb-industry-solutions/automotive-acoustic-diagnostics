import { useState, useEffect } from "react";
import { Option, Select } from "@leafygreen-ui/select";
import styles from "./audioDevicePicker.module.css";

const AudioDevicePicker = ({ deviceId, setDeviceId, recording }) => {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    // navigator.mediaDevices only exists in a secure context (HTTPS or
    // localhost). On a plain-HTTP origin it is undefined, and reading
    // .getUserMedia off it throws synchronously - an uncaught throw here takes
    // down the whole page, so bail out and leave the picker empty instead.
    if (!navigator.mediaDevices?.getUserMedia) {
      console.warn(
        "Microphone unavailable: getUserMedia is unsupported or the page " +
          "is not served over HTTPS or localhost."
      );
      return;
    }

    // Request permission to access audio devices
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => {
        // Once permission is granted, enumerate devices
        navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
          const audioDevices = deviceInfos.filter(
            (device) => device.kind === "audioinput"
          );
          setDevices(audioDevices);
          if (audioDevices.length > 0) {
            setDeviceId(audioDevices[0].deviceId);
          }
        });
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });
  }, [setDeviceId]);

  return (
    <>
      <div className={styles.deviceSection}>
        <p>Select Microphone: </p>
        <Select
          id="microphone-select"
          value={deviceId}
          aria-label="Microphone Select"
          placeholder=""
          disabled={recording}
          onChange={(value) => setDeviceId(value)}
        >
          {devices.map((device) => (
            <Option key={device.deviceId} value={device.deviceId}>
              {device.label || `Microphone ${device.deviceId}`}
            </Option>
          ))}
        </Select>
      </div>
    </>
  );
};

export default AudioDevicePicker;
