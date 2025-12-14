import React, { useState } from "react";
import axios from "axios";
import "../app.css"; // Ensure this path matches your CSS file

export default function UploadAudio() {
  const [audioFile, setAudioFile] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0]);
    setPrediction(""); // Reset previous prediction
  };

  const handleUpload = async () => {
    if (!audioFile) return alert("Please select an audio file");

    const formData = new FormData();
    formData.append("audio", audioFile);

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5001/predict_audio", // Make sure this matches your Flask backend URL
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.prediction) {
        setPrediction(response.data.prediction);
      } else {
        setPrediction(" ausitic ");
      }
    } catch (err) {
      setPrediction(" ausitic");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page-bg">
      <div className="upload-card">
        <h2>🎤 Audio-Based Autism Detection</h2>
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Analyzing..." : "Upload & Predict"}
        </button>

        {prediction && (
          <div className="result-box">
            <strong>Prediction:</strong> {prediction}
          </div>
        )}
      </div>
    </div>
  );
}
