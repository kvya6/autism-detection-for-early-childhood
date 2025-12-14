import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css"; // ✅ make sure to include styles

export default function Feedback() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    if (feedback.trim() === "") {
      alert("⚠️ Please enter your feedback before submitting.");
      return;
    }
    console.log("User Feedback:", feedback);
    alert("✅ Thank you for your valuable feedback!");
    setFeedback("");
  };

  return (
    <div className="feedback-bg">
      <div className="feedback-card-glass">
        <h1 className="feedback-title">💬 We Value Your Feedback</h1>
        <p className="feedback-subtitle">
          Help us improve by sharing your thoughts and experiences.
        </p>

        <textarea
          placeholder="Write your feedback here..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="feedback-textarea"
        />

        <button onClick={handleSubmit} className="feedback-btn">
          Submit Feedback
        </button>

        <button onClick={() => navigate("/")} className="feedback-back-btn">
          ⬅ Back
        </button>
      </div>
    </div>
  );
}
