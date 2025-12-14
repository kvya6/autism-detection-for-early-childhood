import React, { useState } from "react";
import "./App.css";

function App() {
  const questions = [
    { q: "Does your child respond when you smile or call their name?", autismYes: false },
    { q: "Does your child make eye contact with you?", autismYes: false },
    { q: "Does your child avoid eye contact often?", autismYes: true },
    { q: "Does your child like playing alone?", autismYes: true },
    { q: "Does your child imitate sounds or gestures?", autismYes: false },
    { q: "Does your child react when you point at something?", autismYes: false },
    { q: "Does your child flap hands or rock body repeatedly?", autismYes: true },
    { q: "Does your child show interest in other children?", autismYes: false },
    { q: "Does your child have trouble with changes in routine?", autismYes: true },
    { q: "Does your child use simple words or gestures to communicate?", autismYes: false },
    { q: "Does your child get upset with loud sounds or lights?", autismYes: true },
    { q: "Does your child smile back when you smile?", autismYes: false },
    { q: "Does your child repeat words or phrases often?", autismYes: true },
    { q: "Does your child respond to their name being called?", autismYes: false },
    { q: "Does your child make unusual facial expressions?", autismYes: true },
  ];

  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (answer) => {
    const currentQuestion = questions[current];

    // Scoring logic: +1 only when the answer matches autismYes condition
    if (
      (answer === "Yes" && currentQuestion.autismYes) ||
      (answer === "No" && !currentQuestion.autismYes)
    ) {
      setScore(score + 1);
    }

    const next = current + 1;
    if (next < questions.length) {
      setCurrent(next);
    } else {
      setFinished(true);
    }
  };

  const restartQuiz = () => {
    setCurrent(0);
    setScore(0);
    setFinished(false);
  };

  return (
    <div className="App">
      <div className="quiz-card">
        <h1 className="quiz-title">🧩 Autism Detection Quiz for Early Childhood</h1>

        {/* 🌈 Progress Bar */}
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        {!finished ? (
          <>
            <h2 className="question-count">
              Question {current + 1} of {questions.length}
            </h2>
            <p className="question-text">{questions[current].q}</p>

            <div className="button-group">
              <button className="btn yes" onClick={() => handleAnswer("Yes")}>
                Yes
              </button>
              <button className="btn no" onClick={() => handleAnswer("No")}>
                No
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="quiz-complete">Quiz Completed!</h2>
            <p className="score-text">
              Your Score: {score} / {questions.length}
            </p>

            {score >= 6 ? (
              <h3 className="result-bad">
                ⚠️ Possible signs of autism — please consult a specialist.
              </h3>
            ) : (
              <h3 className="result-good">
                ✅ Child seems to show typical development signs.
              </h3>
            )}

            <button className="btn restart" onClick={restartQuiz}>
              Restart Quiz
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;



