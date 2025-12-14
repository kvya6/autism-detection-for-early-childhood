import React, { useState } from "react";
import axios from "axios";
import "../App.css";

export default function Quiz() {
  const questions = [
    "Does your child respond when you smile or call their name?",
    "Does your child make eye contact with you?",
    "Does your child avoid eye contact often?",
    "Does your child like playing alone?",
    "Does your child imitate sounds or gestures?",
    "Does your child react when you point at something?",
    "Does your child flap hands or rock body repeatedly?",
    "Does your child show interest in other children?",
    "Does your child have trouble with changes in routine?",
    "Does your child use simple words or gestures to communicate?",
    "Does your child get upset with loud sounds or lights?",
    "Does your child smile back when you smile?",
    "Does your child repeat words or phrases often?",
    "Does your child respond to their name being called?",
    "Does your child make unusual facial expressions?",
  ];

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [prediction, setPrediction] = useState("");

  const handleAnswer = async (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    const next = current + 1;
    if (next < questions.length) {
      setCurrent(next);
    } else {
      // Quiz finished: send all answers to backend
      try {
        const response = await axios.post("http://localhost:5003/submit-quiz", {
          answers: newAnswers,
        });
        setPrediction(response.data.prediction + ` (Score: ${response.data.score})`);
        setFinished(true);
      } catch (err) {
        console.error(err);
        setPrediction("Error submitting quiz");
        setFinished(true);
      }
    }
  };

  const restartQuiz = () => {
    setCurrent(0);
    setAnswers([]);
    setFinished(false);
    setPrediction("");
  };

  return (
    <div className="quiz-card">
      <h1 className="quiz-title">🧩 Autism Detection Quiz for Early Childhood</h1>

      {!finished ? (
        <>
          <p className="question-text">{questions[current]}</p>
          <div className="button-group">
            <button className="btn yes" onClick={() => handleAnswer("Yes")}>
              Yes
            </button>
            <button className="btn no" onClick={() => handleAnswer("No")}>
              No
            </button>
          </div>
          <p className="question-count">
            Question {current + 1} of {questions.length}
          </p>
        </>
      ) : (
        <>
          <h2 className="quiz-complete">Quiz Completed!</h2>
          <p className="score-text">{prediction}</p>
          <button className="btn restart" onClick={restartQuiz}>
            Restart Quiz
          </button>
        </>
      )}
    </div>
  );
}
