// servers.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5003;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Support 15 questions, all with weight 1 (you can adjust weights per question)
const questionsWeight = Array(15).fill(1);

app.post("/submit-quiz", (req, res) => {
  const { answers } = req.body;

  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: "Invalid answers format" });
  }

  // Ensure answers length matches weights length
  if (answers.length !== questionsWeight.length) {
    return res.status(400).json({ error: "Answers count mismatch" });
  }

  // Count "No" answers as risk
  let score = 0;
  answers.forEach((ans, index) => {
    if (ans.toLowerCase() === "no") score += questionsWeight[index];
  });

  // Threshold for autism risk (example: 6 or more "No")
  const threshold = 6;
  const prediction = score >= threshold ? "Autistic" : "Non Autistic";

  res.json({ prediction, score });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
