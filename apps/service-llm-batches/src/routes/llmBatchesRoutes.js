import express from 'express';
import dotenv from 'dotenv';
import Hive from '../models/hive.js';

dotenv.config();

const router = express.Router();

// Get all hives
router.get('/', async (req, res) => {
  try {
    const hives = await Hive.find();
    res.json(hives);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one hive by ID
router.get('/:id', async (req, res) => {
  try {
    const hive = await Hive.findOne({ hiveId: req.params.id });
    if (!hive) {
      return res.status(404).json({ message: 'Hive not found' });
    }
    res.json(hive);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new hive
router.post('/', async (req, res) => {
  const hive = new Hive({
    hiveId: req.body.hiveId,
    models: req.body.models,
  });
  try {
    const newHive = await hive.save();
    res.status(201).json(newHive);
    console.log('New hive created successfully!');
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a hive
router.patch('/:id', async (req, res) => {
  try {
    const hive = await Hive.findOne({ hiveId: req.params.id });
    if (!hive) {
      return res.status(404).json({ message: 'Hive not found' });
    }

    if (req.body.status) hive.status = req.body.status;
    if (req.body.models) hive.models = req.body.models;
    if (req.body.status === 'completed') hive.completedAt = new Date();

    const updatedHive = await hive.save();
    res.json(updatedHive);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/save-active-hive', (req, res) => {
  const { activeHive } = req.body;

  if (!activeHive || typeof activeHive !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing "activeBatch" string' });
  }

  console.log(`[llm-batches] Received active batch: ${activeHive}`);

  // TODO: store to DB

  res.status(200).json({ status: 'stored' });
});
export default router;
