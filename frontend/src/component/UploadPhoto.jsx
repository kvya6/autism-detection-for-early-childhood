import React, { useState } from "react";
import axios from "axios";
import "../App.css";

const UploadPhoto = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError("");
    setResult(null);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("⚠️ Please upload a photo first!");
      return;
    }

    const formData = new FormData();
    formData.append("photo", file);

    try {
      setLoading(true);
      setError("");
      const res = await axios.post("http://localhost:5000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || 
        "Upload a clear face photo for early autism screening."
      );
    } finally {
      setLoading(false);
    }
  };

  const confidence = (value) => {
    if (value === null || value === undefined) return "N/A";
    return (value * 100).toFixed(2) + "%";
  };

  const getResultColor = (prediction) => {
    if (prediction === "Autistic") return "#ff6b6b";
    if (prediction === "Non-Autistic") return "#51cf66";
    return "#868e96";
  };

  return (
    <div className="upload-bg">
      <div className="upload-card-glass">
        <h1 className="upload-title"> Autism Detection</h1>
        <p className="upload-subtitle">
          Upload a clear face photo for early autism screening using EfficientNetB0 & MobileNetV2.
        </p>

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="file-input-container">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              id="fileInput" 
            />
            <label htmlFor="fileInput" className="file-label">
              📸 Choose a Photo
            </label>
            {file && <span className="file-name">{file.name}</span>}
          </div>

          {preview && (
            <div className="image-preview">
              <img src={preview} alt="Preview" />
            </div>
          )}

          <button 
            type="submit" 
            className="upload-btn" 
            disabled={loading || !file}
          >
            {loading ? "🔄 Analyzing..." : "🚀 Upload & Analyze"}
          </button>
        </form>

        {error && (
          <div className="error-text">
            {error}
          </div>
        )}

        {result && (
          <div className="result-card">
            <h3 className="result-header">📊 Analysis Results</h3>
            
            <div className="final-result">
              <h4> Final Prediction</h4>
              <p className="prediction-main">
                <strong>Result:</strong>{" "}
                <span 
                  className="highlight" 
                  style={{ color: getResultColor(result.final_prediction) }}
                >
                  {result.final_prediction}
                </span>
              </p>
              <p>
                <strong>Confidence:</strong>{" "}
                <span className="confidence-value">
                  {confidence(result.final_confidence)}
                </span>
              </p>
            </div>

            <hr className="divider" />

            <div className="detailed-results">
              <div className="model-result">
                <h4> Face Analysis </h4>
                <p>
                  <strong>Prediction:</strong>{" "}
                  <span style={{ color: getResultColor(result.face_prediction) }}>
                    {result.face_prediction}
                  </span>
                </p>
                <p>
                  <strong>Confidence:</strong>{" "}
                  {confidence(result.face_confidence)}
                </p>
              </div>

              <div className="model-result">
                <h4> Eye Analysis </h4>
                <p>
                  <strong>Prediction:</strong>{" "}
                  <span style={{ color: getResultColor(result.eye_prediction) }}>
                    {result.eye_prediction}
                  </span>
                </p>
                <p>
                  <strong>Confidence:</strong>{" "}
                  {confidence(result.eye_confidence)}
                </p>
                {result.eye_prediction === "Not Detected" && (
                  <p className="eye-note">⚠️ Eye region not clearly detected</p>
                )}
              </div>
            </div>

            <div className="disclaimer">
              <p className="note">
                ⚠️ <strong>Important:</strong> This is a research screening tool powered by AI, 
                not a medical diagnosis. Please consult a qualified medical professional or 
                developmental specialist for clinical evaluation and diagnosis.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPhoto;