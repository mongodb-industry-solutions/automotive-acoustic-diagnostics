let stopRecorder;

export const startRecording = (
  selectedDeviceId,
  audioName,
  setRecording,
  numSamples
) => {
  return new Promise(async (resolve, reject) => {
    if (!selectedDeviceId) {
      console.error("No audio input device selected");
      reject("No audio input device selected");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: selectedDeviceId },
      });
      let samplesSent = 0;
      stopRecorder = false;

      setRecording(true);
      while (samplesSent < numSamples && !stopRecorder) {
        await recordSample(stream, audioName);
        samplesSent++;
      }

      setRecording(false);
      resolve();
    } catch (err) {
      console.error("Error starting recording:", err);
      reject(err);
    }
  });
};

const recordSample = (stream, audioName) => {
  return new Promise(async (resolve, reject) => {
    const recorder = new MediaRecorder(stream);
    const timeslice = 1000; //Recording time per sample in ms
    let chunks = [];

    recorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };

    recorder.onstop = async () => {
      const completeBlob = new Blob(chunks, { type: "audio/webm" });
      try {
        await sendAudioToBackend(completeBlob, audioName);
        resolve(); // Resolve the promise when sample is sent
      } catch (error) {
        console.error(error);
        reject(error);
      }
    };

    recorder.start();

    setTimeout(() => {
      recorder.stop();
      //recorder.stream.getTracks().forEach(track => track.stop());
    }, timeslice);
  });
};

const sendAudioToBackend = async (audioBlob, audioName) => {
  const formData = new FormData();
  formData.append("file", audioBlob, "recording.webm");

  let url = process.env.NEXT_PUBLIC_DIAGNOSTICS_API_URL;

  if (audioName == null) {
    url += `/diagnose`;
  } else {
    url += `/train?audio_name=${audioName}`;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (response.ok && data.success) {
      console.log("Most likely audio: ", data.most_likely_audio);
    } else {
      throw new Error(
        "Failed to get response from API: " + response.statusText
      );
    }
  } catch (error) {
    throw new Error("Error sending audio to backend: " + error.message);
  }
};

const saveAudioLocally = (audioBlob) => {
  const url = URL.createObjectURL(audioBlob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = "recording.webm";
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
};

export const stopRecording = () => {
  stopRecorder = true;
};

export const deletePreviousSamples = async (audioName) => {
  try {
    const response = await fetch("/api/action/deleteMany", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        collection: "sounds",
        filter: { audio: audioName },
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to delete previous samples");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error(`Error deleting previous samples: ${error.message}`);
  }
};
