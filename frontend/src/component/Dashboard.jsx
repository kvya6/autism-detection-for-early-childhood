import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard({ user }) {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page-wrapper">
      <aside className="dashboard-sidebar">
        <h2>Menu</h2>

        {/* Existing navigation */}
        <button onClick={() => navigate("/upload")}>Upload Photo</button>
        <button onClick={() => navigate("/upload-voice")}>Upload Voice</button>
        <button onClick={() => navigate("/quiz")}>Take Quiz</button> {/* 🆕 Quiz */}

        <button onClick={() => navigate("/profile")}>Profile</button>
        <button onClick={() => navigate("/chatbot")}>Chatbot</button>
        <button onClick={() => navigate("/games")}>Games</button>
        <button onClick={() => navigate("/feedback")}>Feedback</button>
        <button onClick={() => navigate("/settings")}>Settings</button>
        <button onClick={() => navigate("/about")}>About</button>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("currentUser");
            window.location.reload();
          }}
        >
          Logout
        </button>
      </aside>

      <main className="dashboard-main-card">
        <h1>Welcome, {user.firstName} 👋</h1>
        <p>
          Use the sidebar to navigate features like{" "}
          <strong> Photo Analysis</strong>,{" "}
          <strong>Voice Detection</strong>,{" "}
          <strong>Quiz</strong>, <strong>Profile</strong>, and{" "}
          <strong>Chatbot Support</strong>.
        </p>
      </main>
    </div>
  );
}
