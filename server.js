require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const app = express();
const port = 3000;
const showdown = require('showdown');
app.use(cors());
app.use(bodyParser.json());

app.post('/getHints', async (req, res) => {
  const { sport, duration, gender, age } = req.body;
  const apiKey = process.env.API_KEY;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-001' });

  const prompt = `Generate a comprehensive diet and exercise plan for a ${age}-year-old ${gender} who plays ${sport} for ${duration} minutes.`;

  try {
    const result = await model.generateContent(prompt);
    const converter = new showdown.Converter();
    const html = converter.makeHtml(result.response.text());
    res.json({ hint: html });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).send('Error generating hints');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:3000/`);
});
