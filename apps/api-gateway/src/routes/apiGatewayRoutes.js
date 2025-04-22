import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

dotenv.config();

const router = express.Router();
const MICROSERVICE_URL = `http://localhost:${process.env.SERVICE_LLM_RESPONSES}/api/chat`;

async function forwardRequest(path, req, res) {
  try {
    const response = await fetch(`${MICROSERVICE_URL}${path}`, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });
    console.log('Message has been sent through API gateway...');

    if (!response.ok) {
      throw new Error(`Microservice responded with ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Forwarding error:', error);
    res.status(500).json({
      error: 'Failed to forward request to microservice',
      details: error.message,
    });
  }
}

router.post('/test', async (req, res) => {
  await forwardRequest('/test', req, res);
});

router.post('/openai', async (req, res) => {
  await forwardRequest('/openai', req, res);
});

router.post('/anthropic', async (req, res) => {
  await forwardRequest('/anthropic', req, res);
});

export default router;
