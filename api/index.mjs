import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import cors from 'cors';

dotenv.config();

const app = express();


app.use((req, res, next) => {
  console.log('Incoming origin:', req.headers.origin);
  next();
});

app.use(cors({
  origin: 'http://smud-frontend-bucket.s3-website.us-east-2.amazonaws.com',
  methods: ['GET', 'POST'],
}));

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});




app.post('/api/chat', async (req, res) => {
  const { userMessage } = req.body;

  if (!userMessage) {
    return res.status(400).json({ error: 'Missing userMessage' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a MUD narrator.' },
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SMUD API running on port ${PORT}`);
});
