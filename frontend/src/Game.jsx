// src/Game.jsx
import React from "react";

// ---------------- PageWithBackground ----------------
const PageWithBackground = ({ children }) => {
  const styles = {
    minHeight: "100vh",
    padding: "40px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    fontFamily: "'Arial', sans-serif",
    color: "#333",
    background: "linear-gradient(to bottom right, #a8edea, #fed6e3)",
    overflow: "hidden",
    position: "relative",
  };

  const floatingShapes = Array.from({ length: 15 }).map((_, i) => {
    const size = Math.random() * 40 + 20;
    const left = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = Math.random() * 10 + 5;
    const colors = ["#FFD700", "#FF69B4", "#87CEFA", "#ADFF2F", "#FFB6C1"];
    const color = colors[Math.floor(Math.random() * colors.length)];

    return (
      <div
        key={i}
        style={{
          position: "absolute",
          top: "-10%",
          left: `${left}%`,
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: "50%",
          opacity: 0.6,
          animation: `floatShape ${duration}s ease-in-out ${delay}s infinite`,
        }}
      />
    );
  });

  return (
    <div style={styles}>
      {floatingShapes}
      {children}
      <style>{`
        @keyframes floatShape {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(80vh) rotate(180deg); }
          100% { transform: translateY(0) rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// ---------------- Main Game Component ----------------
export default function Game() {
  const [activeGame, setActiveGame] = React.useState(null);

  return (
    <PageWithBackground>
      <h2 style={{ marginBottom: '20px' }}>Games</h2>

      {!activeGame && (
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <button className="btn" onClick={() => setActiveGame('colourShapeSorting')}>
            🎨🧩 Colour & Shape Sorting Game
          </button>
          <button className="btn" onClick={() => setActiveGame('reaction')}>
            ⚡ Reaction Tap Game
          </button>
        </div>
      )}

      {activeGame && (
        <GameSelector activeGame={activeGame} onBack={() => setActiveGame(null)} />
      )}
    </PageWithBackground>
  );
}

// ---------------- Game Selector ----------------
function GameSelector({ activeGame, onBack }) {
  const [activeMode, setActiveMode] = React.useState(null);

  if (!activeMode && activeGame === 'colourShapeSorting') {
    return (
      <div style={{ textAlign: "center" }}>
        <h3>🎨🧩 Colour & Shape Sorting Game</h3>
        <p>Select a game mode:</p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn" onClick={() => setActiveMode('shapes')}>Shape Sorting</button>
          <button className="btn" onClick={() => setActiveMode('colours')}>Colour Sorting</button>
        </div>
        <button className="btn" onClick={onBack} style={{ marginTop: '20px' }}>⬅ Back</button>
      </div>
    );
  }

  if (activeMode === 'colours') return <ColourSortingGame onBack={() => setActiveMode(null)} />;
  if (activeMode === 'shapes') return <ShapeSortingGame onBack={() => setActiveMode(null)} />;
  if (activeGame === 'reaction') return <ReactionTapGame onBack={onBack} />;

  return null;
}

// ---------------- Colour Sorting ----------------
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
      setMessage("⚠ 10 seconds left! Hurry up!");
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
    <div style={{ textAlign: "center" }}>
      <h3>🎨 Colour Sorting</h3>
      <p>Drag each color into the correct box! (Text may be tricky!)</p>
      <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
        ⏳ Time Left: {timeLeft}s &nbsp;&nbsp; | &nbsp;&nbsp; Score: {score}
      </p>

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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              color: c.textColor,
            }}
          >
            {c.name}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
        {items.map(c => (
          <div
            key={c.id}
            id={c.id}
            draggable={!gameOver}
            onDragStart={e => {
              e.dataTransfer.setData("colour", c.name);
              e.dataTransfer.setData("id", c.id);
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
            {score >= 15 ? "🌟 Excellent!" : score >= 8 ? "👏 Good job!" : "💪 Don’t give up!"}
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

// ---------------- Shape Sorting ----------------
function ShapeSortingGame({ onBack }) {
  // Similar to ColourSortingGame logic
  return (
    <div style={{ textAlign: "center" }}>
      <h3>🧩 Shape Sorting Game</h3>
      <p>Drag each shape into the correct box before time runs out!</p>
      <button className="btn" onClick={onBack} style={{ marginTop: '20px' }}>⬅ Back</button>
    </div>
  );
}

// ---------------- Reaction Tap ----------------
function ReactionTapGame({ onBack }) {
  // Minimal placeholder: copy your existing ReactionTapGame logic here
  return (
    <div style={{ textAlign: "center" }}>
      <h3>⚡ Reaction Tap Game</h3>
      <p>Tap the correct items as fast as possible!</p>
      <button className="btn" onClick={onBack} style={{ marginTop: '20px' }}>⬅ Back</button>
    </div>
  );
}
