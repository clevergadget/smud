import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';

const router = express.Router();

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/chat', async (req, res) => {
    const { messages } = req.body;  
    console.log(messages)
    if (!messages) {
      return res.status(400).json({ error: 'Missing messages' });
    }
  
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4.1-nano',
        messages
      });
  
      const reply = response.choices[0]?.message?.content;
      res.json({ reply });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to get OpenAI response' });
    }
  });

export default router;
