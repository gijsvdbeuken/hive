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

router.use(async (req, res) => {
  await forwardRequest(req, res);
});

export default router;
