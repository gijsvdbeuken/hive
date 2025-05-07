import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const ROUTING_MAP = {
  '/chat': `http://localhost:${process.env.SERVICE_LLM_RESPONSES}`,
  '/batches': `http://localhost:${process.env.SERVICE_LLM_BATCHES}`,
};

const router = express.Router();

/*
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
*/

async function forwardRequest(req, res) {
  const path = req.path;
  const servicePrefix = Object.keys(ROUTING_MAP).find((prefix) => path.startsWith(prefix));

  if (!servicePrefix) {
    return res.status(404).json({ error: 'No matching microservice found for this route' });
  }

  const targetService = ROUTING_MAP[servicePrefix];
  const fullUrl = `${targetService}/api${path}`;

  try {
    const response = await fetch(fullUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: ['POST', 'PUT', 'PATCH'].includes(req.method) ? JSON.stringify(req.body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Microservice responded with ${response.status}`);
    }

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Gateway forwarding error:', error);
    res.status(500).json({
      error: 'Failed to forward request to microservice',
      details: error.message,
    });
  }
}

/*
router.post('/test', async (req, res) => {
  await forwardRequest('/test', req, res);
});

router.post('/openai', async (req, res) => {
  await forwardRequest('/openai', req, res);
});

router.post('/anthropic', async (req, res) => {
  await forwardRequest('/anthropic', req, res);
});

router.post('/batches/save-active-hive', async (req, res) => {
  const { activeBatch } = req.body;

  if (!activeBatch || typeof activeBatch !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing "activeBatch" string' });
  }
  console.log(`Received active hive: ${activeBatch}`);
  return res.status(200).json({ status: 'ok' });
});
*/

router.use(async (req, res) => {
  await forwardRequest(req, res);
});

export default router;
