import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Components
import Dashboard from "./component/Dashboard.jsx";
import UploadPhoto from "./component/UploadPhoto.jsx";
import About from "./component/About.jsx";
import Profile from "./component/Profile.jsx";
import Settings from "./component/Settings.jsx";
import Feedback from "./component/Feedback.jsx";
import Chatbot from "./component/Chatbot.jsx";
import UploadVoice from "./component/UploadVoice.jsx";
import Quiz from "./component/Quiz.jsx"; // Adjust path if needed


import "./app.css";

function App() {
  const [mode, setMode] = useState(null); // null | login | signup | dashboard
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [signupInfo, setSignupInfo] = useState({
    firstName: "",
    lastName: "",
    childAge: "",
    gender: "",
    fatherName: "",
    motherName: "",
    contact: "",
    email: "",
    password: "",
  });

  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || null
  );

  useEffect(() => {
    if (currentUser) setMode("dashboard");
  }, [currentUser]);

  const validateEmail = (email) => email.endsWith("@gmail.com");
  const validatePassword = (pwd) =>
    /[!@#$%^&*(),.?":{}|<>]/.test(pwd) && pwd.length >= 12;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) return setLoginError("Email must be Gmail.");
    if (!validatePassword(password)) return setLoginError("Password invalid.");

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const foundUser = users.find((u) => u.email === email);
    if (!foundUser) return setLoginError("No account found.");

    localStorage.setItem("currentUser", JSON.stringify(foundUser));
    setCurrentUser(foundUser);
    setLoginError("");
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push(signupInfo);
    localStorage.setItem("users", JSON.stringify(users));

    localStorage.setItem("currentUser", JSON.stringify(signupInfo));
    setCurrentUser(signupInfo);
  };

  if (mode !== "dashboard") {
    return (
      <PageWithBackground>
        <div className="auth-box">
          <h1 className="title">Autism Detection</h1>

          {mode === null && (
            <div className="flex flex-col gap-4">
              <button className="btn" onClick={() => setMode("login")}>
                Login
              </button>
              <button className="btn" onClick={() => setMode("signup")}>
                Sign Up
              </button>
            </div>
          )}

          {mode === "login" && (
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3 left-align">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {loginError && <p style={{ color: "red" }}>{loginError}</p>}
              <button className="btn" type="submit">Login</button>
              <button className="btn logout-btn" type="button" onClick={() => setMode(null)}>
                Back
              </button>
            </form>
          )}

          {mode === "signup" && (
  <form
    onSubmit={handleSignupSubmit}
    className="signup-card"
  >
    <h2 className="form-title">Create Account</h2>

    {/* Parent Info */}
    <div className="form-section">
      <h3 className="section-title">Child's Name</h3>
      <input
        type="text"
        placeholder="First Name"
        required
        onChange={(e) =>
          setSignupInfo({ ...signupInfo, firstName: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Last Name"
        required
        onChange={(e) =>
          setSignupInfo({ ...signupInfo, lastName: e.target.value })
        }
      />
    </div>

    {/* Child Info */}
    <div className="form-section">
      <h3 className="section-title">Child's Details</h3>
      <select
        required
        defaultValue=""
        onChange={(e) =>
          setSignupInfo({ ...signupInfo, gender: e.target.value })
        }
      >
        <option value="" disabled>
          Select Gender
        </option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>

      <select
        required
        defaultValue=""
        onChange={(e) =>
          setSignupInfo({ ...signupInfo, childAge: e.target.value })
        }
      >
        <option value="" disabled>
          Select Child Age
        </option>
        {[...Array(18)].map((_, i) => (
          <option key={i} value={i + 1}>
            {i + 1} years
          </option>
        ))}
      </select>
    </div>

    {/* Parent Names */}
    <div className="form-section">
      <h3 className="section-title">Parent Names</h3>
      <input
        type="text"
        placeholder="Father's Name"
        required
        onChange={(e) =>
          setSignupInfo({ ...signupInfo, fatherName: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Mother's Name"
        required
        onChange={(e) =>
          setSignupInfo({ ...signupInfo, motherName: e.target.value })
        }
      />
    </div>

    {/* Contact & Account */}
    <div className="form-section">
      <h3 className="section-title">Contact & Account</h3>
      <input
        type="tel"
        placeholder="Contact Number"
        pattern="[0-9]{10}"
        title="Enter a 10-digit phone number"
        required
        onChange={(e) =>
          setSignupInfo({ ...signupInfo, contact: e.target.value })
        }
      />
      <input
        type="email"
        placeholder="Email (Gmail only)"
        required
        onChange={(e) =>
          setSignupInfo({ ...signupInfo, email: e.target.value })
        }
      />
      <input
        type="password"
        placeholder="Password (min 12 chars & special char)"
        minLength={12}
        pattern='(?=.*[!@#$%^&*(),.?":{}|<>]).{12,}'
        title="At least 12 characters and one special symbol"
        required
        onChange={(e) =>
          setSignupInfo({ ...signupInfo, password: e.target.value })
        }
      />
    </div>

    <div className="form-buttons">
      <button className="btn btn-primary" type="submit">
        Sign Up
      </button>
      <button
        className="btn btn-secondary"
        type="button"
        onClick={() => setMode(null)}
      >
        Back
      </button>
    </div>
  </form>
)}

        </div>
      </PageWithBackground>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard user={currentUser} />} />
        <Route path="/upload" element={<UploadPhoto />} />
        <Route path="/about" element={<About />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/profile" element={<Profile user={currentUser} />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/games" element={<Games />} />
        <Route path="/upload-voice" element={<UploadVoice />} />
        <Route path="/quiz" element={<Quiz />} />


      </Routes>
    </Router>
  );
}

function PageWithBackground({ children }) {
return (
<div
style={{
backgroundImage: 'url(/autism_image.jpg)',
backgroundSize: 'cover',
backgroundPosition: 'center',
minHeight: '100vh',
color: 'Black',
padding: '20px',
}}
>
{children}
</div>
);
}
function Games() {
  const [activeGame, setActiveGame] = React.useState(null);

  return (
    <PageWithBackground>
      <h2 style={{ marginBottom: '20px' }}>Games</h2>

      {/* Show the menu when no game is active */}
      {!activeGame && (
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {/* Updated to show Colour & Shape Sorting Game */}
          <button className="btn" onClick={() => setActiveGame('colourShapeSorting')}>
            🎨🧩 Colour & Shape Sorting Game
          </button>
          <button className="btn" onClick={() => setActiveGame('reaction')}>
            ⚡ Reaction Tap Game
          </button>
        </div>
      )}

      {/* Render Colour & Shape Sorting Game */}
      {activeGame === 'colourShapeSorting' && (
        <ColourAndShapeSortingGame onBack={() => setActiveGame(null)} />
      )}

      {/* Render Reaction Tap Game */}
      {activeGame === 'reaction' && (
        <ReactionTapGame onBack={() => setActiveGame(null)} />
      )}
    </PageWithBackground>
  );
}
// ---------------- Shape & Color Sorting Game (Enhanced) ----------------
function ColourAndShapeSortingGame({ onBack }) {
  const [activeMode, setActiveMode] = React.useState(null);

  return (
    <div style={{ textAlign: "center" }}>
      {!activeMode ? (
        <>
          <h3>🎨🧩 Colour & Shape Sorting Game</h3>
          <p>Select a game mode:</p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn" onClick={() => setActiveMode('shapes')}>Shape Sorting</button>
            <button className="btn" onClick={() => setActiveMode('colours')}>Colour Sorting</button>
          </div>
          <button className="btn" onClick={onBack} style={{ marginTop: '20px' }}>⬅ Back</button>
        </>
      ) : activeMode === 'shapes' ? (
        <ShapeSortingGame onBack={() => setActiveMode(null)} />
      ) : (
        <ColourSortingGame onBack={() => setActiveMode(null)} />
      )}
    </div>
  );
}
// --------------------ColourSortingGame--------------------
function ColourSortingGame({ onBack }) {
  const colours = [
    { name: "YELLOW", value: "#FFFF00", textColor: "red" },
    { name: "RED", value: "#FF0000", textColor: "blue" },
    { name: "BLUE", value: "#0000FF", textColor: "green" },
    { name: "GREEN", value: "#00FF00", textColor: "orange" },
    { name: "ORANGE", value: "#FFA500", textColor: "purple" },
    { name: "PURPLE", value: "#800080", textColor: "yellow" },
    { name: "PINK", value: "#FFC0CB", textColor: "brown" },
  ];

  const [items, setItems] = React.useState(
    colours.flatMap(c => Array(3).fill({ ...c })).map((c, idx) => ({ ...c, id: `color-${idx}` })).sort(() => Math.random() - 0.5)
  );

  const [score, setScore] = React.useState(0);
  const [message, setMessage] = React.useState(null);
  const [gameOver, setGameOver] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(60);
  const [reminderShown, setReminderShown] = React.useState(false);

  React.useEffect(() => {
    if (gameOver) return;
    if (timeLeft <= 0) {
      setGameOver(true);
      setMessage("⏰ Time’s up!");
      setTimeout(() => setMessage(null), 1500);
      setTimeout(onBack, 5000);
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    if (timeLeft === 10 && !reminderShown) {
      setMessage("⚠️ 10 seconds left! Hurry up!");
      setReminderShown(true);
      setTimeout(() => setMessage(null), 1500);
    }
    return () => clearInterval(timer);
  }, [timeLeft, gameOver, reminderShown]);

  const handleDrop = (e, targetName) => {
    e.preventDefault();
    if (gameOver) return;
    const draggedName = e.dataTransfer.getData("colour");
    const id = e.dataTransfer.getData("id");
    const element = document.getElementById(id);

    if (draggedName === targetName) {
      setScore(s => s + 1);
      setMessage("🎉 Great job!");
    } else {
      setScore(s => s - 1);
      setMessage(`❌ Oops! That was ${draggedName}`);
    }

    if (element) element.style.display = "none";
    setItems(prev => prev.filter(i => i.id !== id));

    setTimeout(() => setMessage(null), 1500);

    if (items.length - 1 === 0) {
      setTimeout(() => {
        setGameOver(true);
        setTimeout(onBack, 5000);
      }, 500);
    }
  };

  const getColourStyle = (colour) => ({
    width: "60px",
    height: "60px",
    background: colour.value,
    borderRadius: "8px",
    cursor: gameOver ? "not-allowed" : "grab",
    opacity: gameOver ? 0.5 : 1,
    animation: "float 3s ease-in-out infinite",
  });

  return (
    <div>
      <h3>🎨 Colour Sorting</h3>
      <p>Drag each color into the correct box! (Text may be tricky!)</p>
      <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
        ⏳ Time Left: {timeLeft}s &nbsp;&nbsp; | &nbsp;&nbsp; Score: {score}
      </p>

      {/* Boxes */}
      <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap", marginBottom: "30px" }}>
        {colours.map(c => (
          <div
            key={c.name}
            onDragOver={e => e.preventDefault()}
            onDrop={e => handleDrop(e, c.name)}
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "12px",
              border: "2px solid rgba(255,255,255,0.6)",
              background: "linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(173,216,230,0.2))",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              color: c.textColor,
              boxShadow: "0 8px 20px rgba(0,0,0,0.2), inset 0 0 10px rgba(255,255,255,0.3)",
            }}
          >
            {c.name}
          </div>
        ))}
      </div>

      {/* Colour items */}
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
        {items.map(c => (
          <div
            key={c.id}
            id={c.id}
            draggable={!gameOver}
            onDragStart={e => {
              e.dataTransfer.setData("colour", c.name);
              e.dataTransfer.setData("id", c.id);
              const ghost = e.target.cloneNode(true);
              ghost.style.position = "absolute";
              ghost.style.top = "-9999px";
              document.body.appendChild(ghost);
              e.dataTransfer.setDragImage(ghost, 30, 30);
              setTimeout(() => document.body.removeChild(ghost), 0);
            }}
            style={getColourStyle(c)}
          ></div>
        ))}
      </div>

      {message && (
        <div style={{
          position: "fixed", top: "20px", left: "50%",
          transform: "translateX(-50%)", backgroundColor: "#333", color: "#fff",
          padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", zIndex: 1000,
        }}>
          {message}
        </div>
      )}

      {gameOver && (
        <div style={{ marginTop: "30px" }}>
          <h3>🎮 Game Over!</h3>
          <p>Your final score: {score}</p>
          <p>
            {score >= 15
              ? "🌟 Excellent!"
              : score >= 8
              ? "👏 Good job!"
              : "💪 Don’t give up!"}
          </p>
          <p>Returning to menu in 5 seconds...</p>
        </div>
      )}

      <button className="btn" onClick={onBack} style={{ marginTop: "20px" }}>⬅ Back</button>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
//---------------------- shape sortinggame----------------------
function ShapeSortingGame({ onBack }) {
  const shapes = [
    { type: "square" },
    { type: "circle" },
    { type: "triangle" },
    { type: "pentagon" },
    { type: "hexagon" },
    { type: "rectangle" },
    { type: "star" },
    { type: "oval" },
    { type: "diamond" },
  ];

  const [items, setItems] = React.useState(
    shapes
      .flatMap((s) => Array(3).fill({ ...s }))
      .map((s, idx) => ({ ...s, id: `shape-${idx}` }))
      .sort(() => Math.random() - 0.5)
  );

  const [score, setScore] = React.useState(0);
  const [message, setMessage] = React.useState(null);
  const [gameOver, setGameOver] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(60);
  const [reminderShown, setReminderShown] = React.useState(false);

  React.useEffect(() => {
    if (gameOver) return;

    if (timeLeft <= 0) {
      setGameOver(true);
      setMessage("⏰ Time’s up!");
      setTimeout(() => setMessage(null), 1500);
      setTimeout(onBack, 5000);
      return;
    }

    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);

    if (timeLeft === 10 && !reminderShown) {
      setMessage("⚠️ 10 seconds left! Hurry up!");
      setReminderShown(true);
      setTimeout(() => setMessage(null), 1500);
    }

    return () => clearInterval(timer);
  }, [timeLeft, gameOver, reminderShown]);

  const handleDrop = (e, targetShape) => {
    e.preventDefault();
    if (gameOver) return;

    const draggedShape = e.dataTransfer.getData("shape");
    const id = e.dataTransfer.getData("id");
    const element = document.getElementById(id);

    if (draggedShape === targetShape) {
      setScore((s) => s + 1);
      setMessage("🎉 Great job!");
    } else {
      setScore((s) => s - 1);
      setMessage(`❌ Oops! That was a ${draggedShape.toUpperCase()}.`);
    }

    if (element) element.style.display = "none";
    setItems((prev) => prev.filter((i) => i.id !== id));

    setTimeout(() => setMessage(null), 1500);

    if (items.length - 1 === 0) {
      setTimeout(() => {
        setGameOver(true);
        setTimeout(onBack, 5000);
      }, 500);
    }
  };

  const getShapeStyle = (type) => {
    const baseColor = "#ff9800";
    const gradient = `linear-gradient(145deg, ${baseColor}, #ffb74d)`;
    const shadow =
      "4px 4px 8px rgba(0,0,0,0.3), -2px -2px 6px rgba(255,255,255,0.5), inset 2px 2px 5px rgba(0,0,0,0.2)";

    let width = "60px";
    let height = "60px";
    if (type === "rectangle") height = "40px";
    if (type === "oval") {
      width = "50px";
      height = "90px";
    }

    return {
      width,
      height,
      background: gradient,
      boxShadow: shadow,
      clipPath:
        type === "circle"
          ? "circle(50%)"
          : type === "square"
          ? "inset(0)"
          : type === "triangle"
          ? "polygon(50% 0%, 0% 100%, 100% 100%)"
          : type === "pentagon"
          ? "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)"
          : type === "hexagon"
          ? "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)"
          : type === "rectangle"
          ? "inset(0)"
          : type === "oval"
          ? "ellipse(50% 45% at 50% 50%)"
          : type === "diamond"
          ? "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
          : "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
      cursor: gameOver ? "not-allowed" : "grab",
      opacity: gameOver ? 0.5 : 1,
      animation: "float 3s ease-in-out infinite",
      transform: "rotateX(10deg) rotateY(5deg)",
    };
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h3>🧩 Shape Sorting Game</h3>
      <p>Drag each shape into the correct box before time runs out!</p>

      <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
        ⏳ Time Left: {timeLeft}s &nbsp;&nbsp; | &nbsp;&nbsp; Score: {score}
      </p>

      {/* Glass + water drop boxes */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "30px",
        }}
      >
        {shapes.map((s) => (
          <div
            key={s.type}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, s.type)}
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "12px",
              border: "2px solid rgba(255,255,255,0.6)",
              background: "linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(173,216,230,0.2))",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              color: "#333",
              boxShadow: "0 8px 20px rgba(0,0,0,0.2), inset 0 0 10px rgba(255,255,255,0.3)",
            }}
          >
            {s.type.toUpperCase()}
          </div>
        ))}
      </div>

      {/* Shapes to drag */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        {items.map((s) => (
          <div
            key={s.id}
            id={s.id}
            draggable={!gameOver}
            onDragStart={(e) => {
              e.dataTransfer.setData("shape", s.type);
              e.dataTransfer.setData("id", s.id);
              const ghost = e.target.cloneNode(true);
              ghost.style.position = "absolute";
              ghost.style.top = "-9999px";
              document.body.appendChild(ghost);
              e.dataTransfer.setDragImage(ghost, 30, 30);
              setTimeout(() => document.body.removeChild(ghost), 0);
            }}
            style={getShapeStyle(s.type)}
          ></div>
        ))}
      </div>

      {message && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#333",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "8px",
            fontWeight: "bold",
            zIndex: 1000,
          }}
        >
          {message}
        </div>
      )}

      {gameOver && (
        <div style={{ marginTop: "30px" }}>
          <h3>🎮 Game Over!</h3>
          <p>Your final score: {score}</p>
          <p>
            {score >= 15
              ? "🌟 Excellent! You’re a shape master!"
              : score >= 8
              ? "👏 Good job! Keep practicing!"
              : "💪 Don’t give up! You’ll improve next time!"}
          </p>
          <p>Returning to menu in 5 seconds...</p>
        </div>
      )}

      <button className="btn" onClick={onBack} style={{ marginTop: "20px" }}>
        ⬅ Back
      </button>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
//----------Tapgame----------------
function ReactionTapGame({ onBack }) {
  const [category, setCategory] = React.useState(null);
  const [chosenItem, setChosenItem] = React.useState(null);
  const [targets, setTargets] = React.useState([]);
  const [score, setScore] = React.useState(0);
  const [timeLeft, setTimeLeft] = React.useState(60); // 1 minute
  const [gameOver, setGameOver] = React.useState(false);
  const [oopsMessage, setOopsMessage] = React.useState({ show: false, x: 0, y: 0 });
  const [plusOne, setPlusOne] = React.useState({ show: false, x: 0, y: 0 });
  const [comboBonus, setComboBonus] = React.useState({ show: false, x: 0, y: 0 });
  const [combo, setCombo] = React.useState(0);
  const [level, setLevel] = React.useState(1);

  const speedRef = React.useRef(1500);
  const intervalRef = React.useRef(null);

  const correctSound = React.useRef(new Audio('/sounds/ding.mp3'));
  const wrongSound = React.useRef(new Audio('/sounds/oops.mp3'));

  const items = {
    balls: [
      { display: '', color: 'red', name: 'Red' },
      { display: '', color: 'blue', name: 'Blue' },
      { display: '', color: 'green', name: 'Green' },
      { display: '', color: 'yellow', name: 'Yellow' },
      { display: '', color: 'purple', name: 'Purple' }
    ],
    animals: [
      { display: '🐶', name: 'Dog' },
      { display: '🐱', name: 'Cat' },
      { display: '🐰', name: 'Rabbit' },
      { display: '🦊', name: 'Fox' },
      { display: '🐸', name: 'Frog' }
    ],
    flowers: [
      { display: '🌹', name: 'Rose' },
      { display: '🌻', name: 'Sunflower' },
      { display: '🌷', name: 'Tulip' },
      { display: '🌼', name: 'Daisy' },
      { display: '🌸', name: 'Cherry Blossom' }
    ]
  };

  const moveTargets = () => {
    const newPositions = items[category].map(item => ({
      ...item,
      x: Math.random() * 70,
      y: Math.random() * 50
    }));
    setTargets(newPositions);
  };

  React.useEffect(() => {
    if (!chosenItem || gameOver) return;

    intervalRef.current = setInterval(moveTargets, speedRef.current);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          clearInterval(intervalRef.current);
          setGameOver(true);
          return 0;
        }

        const elapsed = 60 - prev + 1;
        if (elapsed === 30) {
          speedRef.current = Math.max(200, speedRef.current * 0.95);
          clearInterval(intervalRef.current);
          intervalRef.current = setInterval(moveTargets, speedRef.current);
          setLevel(2);
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(timer);
    };
  }, [chosenItem, gameOver]);

  const handleClick = (item, e) => {
    if (gameOver) return;
    const rect = e.target.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top - 20;

    if (item.name === chosenItem.name) {
      correctSound.current.play();
      setScore(prev => prev + 1); // +1 per correct tap

      setPlusOne({ show: true, x, y });
      setTimeout(() => setPlusOne({ show: false, x: 0, y: 0 }), 400);

      setCombo(prev => {
        const newCombo = prev + 1;

        // Bonus for every 5 combos
        if (newCombo === 5) {
          setScore(prevScore => prevScore + 2); // +2 bonus points
          setComboBonus({ show: true, x, y });
          setTimeout(() => setComboBonus({ show: false, x: 0, y: 0 }), 600);
          return 0; // reset combo
        }

        return newCombo;
      });

    } else {
      wrongSound.current.play();
      setScore(prev => Math.max(0, prev - 1)); // -1 for wrong tap
      setOopsMessage({ show: true, x, y });
      setTimeout(() => setOopsMessage({ show: false, x: 0, y: 0 }), 400);
      setCombo(0);
    }
  };

  const getLevelText = (score) => {
    if (score >= 40) return "🌟 Superstar!";
    if (score >= 30) return "🎉 Great Job!";
    if (score >= 20) return "👍 Good Effort!";
    return "💪 Keep Practicing!";
  };

  if (!category) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Choose a category to play with 🎯</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
          {Object.keys(items).map(cat => (
            <button key={cat} className="btn" onClick={() => setCategory(cat)}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (!chosenItem) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Choose your favorite {category.slice(0, -1)} 🏆</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
          {items[category].map(item => (
            <div
              key={item.name}
              onClick={() => setChosenItem(item)}
              style={{
                width: '70px',
                height: '70px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: category === 'balls' ? '0' : '2.5rem',
                backgroundColor: category === 'balls' ? item.color : 'transparent',
                borderRadius: category === 'balls' ? '50%' : '0',
                cursor: 'pointer',
                border: 'none',
                textAlign: 'center'
              }}
            >
              {category !== 'balls' ? item.display : null}
              <span style={{ fontSize: '0.9rem', marginTop: '5px' }}>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', height: '450px', marginBottom: '20px' }}>
      {!gameOver && targets.map((t, idx) => (
        <div
          key={idx}
          onClick={(e) => handleClick(t, e)}
          style={{
            position: 'absolute',
            top: `${t.y}%`,
            left: `${t.x}%`,
            width: '90px',
            height: '90px',
            backgroundColor: category === 'balls' ? t.color : 'transparent',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: category !== 'balls' ? '3rem' : '0',
            borderRadius: category === 'balls' ? '50%' : '0',
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
        >
          {category !== 'balls' ? t.display : null}
        </div>
      ))}

      {oopsMessage.show && (
        <div style={{
          position: 'absolute',
          top: oopsMessage.y,
          left: oopsMessage.x,
          backgroundColor: 'rgba(255,255,255,0.8)',
          padding: '4px 8px',
          borderRadius: '6px',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          color: '#FF5733',
          zIndex: 10
        }}>
          Oops! 😅
        </div>
      )}

      {plusOne.show && (
        <div style={{
          position: 'absolute',
          top: plusOne.y,
          left: plusOne.x,
          backgroundColor: 'rgba(200,255,200,0.9)',
          padding: '4px 8px',
          borderRadius: '6px',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          color: '#28a745',
          zIndex: 10
        }}>
          +1 🎉
        </div>
      )}

      {comboBonus.show && (
        <div style={{
          position: 'absolute',
          top: comboBonus.y,
          left: comboBonus.x,
          backgroundColor: 'rgba(255,230,100,0.9)',
          padding: '4px 8px',
          borderRadius: '6px',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          color: '#e67e22',
          zIndex: 10
        }}>
          +2 🎉
        </div>
      )}

      {!gameOver ? (
        <>
          <p>Level: {level} 🏅</p>
          <p>Tap only the {chosenItem.name}! 🏃‍♂️</p>
          <p>Score: {score} | Combo: {combo}</p>
          <p>Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
        </>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h2>⏰ Game Over!</h2>
          <h3>Your Final Score: {score}</h3>
          <h3>{getLevelText(score)}</h3>
          <button className="btn" onClick={onBack}>Back</button>
        </div>
      )}
    </div>
  );
}
export default App;
