import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import cors from 'cors';

import fs from 'fs';
import path from 'path';

const resolveMudFile = (mud, filename) => {
  const localPath = path.join('mud-data', mud, filename);
  const fallbackPath = path.join('mud-data-default', mud, filename);

  if (fs.existsSync(localPath)) {
    return fs.readFileSync(localPath, 'utf-8');
  } else if (fs.existsSync(fallbackPath)) {
    return fs.readFileSync(fallbackPath, 'utf-8');
  } else {
    return `No data found for MUD "${mud}".`;
  }
};

dotenv.config();

const app = express();


app.use((req, res, next) => {
  console.log('Incoming origin:', req.headers.origin);
  next();
});

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ],  methods: ['GET', 'POST'],
}));

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


app.get('/api/intro', (req, res) => {
  const mud = req.query.mud || 'darkswamp';
  const introText = resolveMudFile(mud, 'intro.md');
  res.send(introText);
});

app.post('/api/chat', async (req, res) => {
  const { userMessage, mud } = req.body;
  const mudName = mud || 'darkswamp';
  const introText = resolveMudFile(mudName, 'intro.md');


  if (!userMessage) {
    return res.status(400).json({ error: 'Missing userMessage' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4.1-nano',
      messages: [
        { role: 'system', content: `You are a MUD narrator. Especially as a MUD is distinct from a MUCK or MUSH. it has an intro text of ${introText}` },
        { role: 'user', content: userMessage },
      ],
    });

    const reply = response.choices[0]?.message?.content;
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get OpenAI response' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`SMUD API running on port ${PORT}`);
});
