import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userMessage } = req.body;
  if (!userMessage) {
    return res.status(400).json({ message: 'Missing userMessage in request body' });
  }

  try {
    // Load system prompt from the darkswamp directory
    const systemPromptPath = path.join(process.cwd(), 'public', 'mudData', 'darkswamp', 'system.txt');
    const systemPrompt = fs.readFileSync(systemPromptPath, 'utf-8');

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
    });

    const assistantMessage = response.choices[0]?.message?.content;
    return res.status(200).json({ reply: assistantMessage });
  } catch (error: any) {
    console.error('OpenAI error:', error);
    return res.status(500).json({
      message: 'Failed to get response from OpenAI',
      error: error.message || 'Unknown error',
    });
  }
}
