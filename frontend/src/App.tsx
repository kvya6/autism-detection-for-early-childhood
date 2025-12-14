import React, { useState } from "react";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a photo first.");
      return;
    }

    setLoading(true);
    setResult(null);
    setConfidence(null);

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data.prediction);
        setConfidence(data.confidence);
      } else {
        alert(data.error || "Prediction failed");
      }
    } catch (err) {
      alert("Error connecting to the server.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Autism Detection</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="photoUpload">Upload Child's Photo:</label>
        <br />
        <input
          type="file"
          accept="image/*"
          id="photoUpload"
          onChange={handleFileChange}
        />
        <br /><br />
        <button type="submit" disabled={loading}>
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>

      {file && <p>Selected file: {file.name}</p>}
      {result && confidence !== null && (
        <div>
          <h2>Prediction: {result}</h2>
          <p>Confidence: {(confidence * 100).toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
}

export default App;

