require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dialogflow = require('@google-cloud/dialogflow');

const app = express();
const port = process.env.PORT || 5500;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Dialogflow client
const sessionClient = new dialogflow.SessionsClient({
  credentials: {
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
});

// Test route
app.get('/', (req, res) => {
  res.send('✅ Server is running continuously');
});

// Chat endpoint
app.post('/chat', async (req, res) => {
  const { message, sessionId } = req.body;
  if (!message || !sessionId) return res.status(400).json({ error: 'Missing message or sessionId' });

  const sessionPath = sessionClient.projectAgentSessionPath(
    process.env.GOOGLE_PROJECT_ID,
    sessionId
  );

  try {
    const responses = await sessionClient.detectIntent({
      session: sessionPath,
      queryInput: { text: { text: message, languageCode: 'en-US' } },
    });

    const result = responses[0].queryResult;
    res.json({ reply: result.fulfillmentText });
  } catch (error) {
    console.error('Dialogflow error:', error);
    res.status(500).json({ error: 'Dialogflow request failed' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`✅ Backend running continuously at http://localhost:${port}`);
});
