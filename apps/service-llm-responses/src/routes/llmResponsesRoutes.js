import express from 'express';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

const router = express.Router();

router.post('/anthropic', async (req, res) => {
  if (!req.body.message || !req.body.message.trim()) {
    return res.status(400).json({ error: 'No message provided.' });
  }
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
  try {
    const { message } = req.body;
    const msg = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 1000,
      temperature: 0.5,
      system: 'Je bent een Nederlandstalige LLM.',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: message,
            },
          ],
        },
      ],
    });
    const response = msg.content[0]?.type === 'text' ? msg.content[0].text : 'No text response received';

    return res.json({ message: response });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

export default router;
