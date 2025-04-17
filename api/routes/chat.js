import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';

import { resolveMudFile } from '../utils/resolveMudFiles.js';

const router = express.Router();

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/chat', async (req, res) => {
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

export default router;
