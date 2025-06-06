import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { deleteAuth0User } from '../utils/auth0-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const ROUTING_MAP = {
  '/users': `${process.env.SERVICE_USER}`,
  '/hives': `${process.env.SERVICE_LLM_HIVES}`,
  '/chat': `${process.env.SERVICE_LLM_RESPONSES}`,
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

router.delete('/users/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const userRes = await fetch(`${process.env.SERVICE_USER}/api/users/${userId}`, {
      method: 'DELETE',
    });
    if (!userRes.ok) {
      const error = await userRes.json();
      return res.status(userRes.status).json(error);
    }
    await deleteAuth0User(userId);
    return res.status(200).json({ message: 'User and all related data deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ error: 'Failed to delete user', details: error.message });
  }
});

router.use(async (req, res) => {
  await forwardRequest(req, res);
});

export default router;
