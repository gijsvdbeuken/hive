import express from 'express';
import dotenv from 'dotenv';
import { Hives } from '../models/hive.js';

dotenv.config();

const router = express.Router();

/*
// Get all hives
router.get('/', async (req, res) => {
  try {
    const hives = await HiveDocument.find();
    res.json(hives);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
*/

/*
// Get one hive by ID
router.get('/:id', async (req, res) => {
  try {
    const hive = await HiveDocument.findOne({ hiveId: req.params.id });
    if (!hive) {
      return res.status(404).json({ message: 'Hive not found' });
    }
    res.json(hive);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
*/

// Create a new hive
router.post('/', async (req, res) => {
  try {
    console.log('Trying to create a new Hive...');
    const { ownerId, hiveId, largeLanguageModels } = req.body;

    if (!ownerId || !hiveId || !largeLanguageModels || !Array.isArray(largeLanguageModels)) {
      return res.status(400).json({ error: 'Missing or invalid fields' });
    }

    // Try to find existing document for this user
    let userDoc = await Hives.findOne({ ownerId });

    const now = new Date();

    // Create new hive object
    const newHive = {
      id: hiveId,
      createdAt: now,
      updatedAt: now,
      large_language_models: {
        model_1: largeLanguageModels[0] || null,
        model_2: largeLanguageModels[1] || null,
        model_3: largeLanguageModels[2] || null,
      },
    };

    if (!userDoc) {
      // No doc yet - create new
      userDoc = new Hives({
        ownerId,
        createdAt: now,
        updatedAt: now,
        hives: [newHive],
        schemaVersion: 1,
      });
    } else {
      // Append new hive
      userDoc.hives.push(newHive);
      userDoc.updatedAt = now;
    }

    await userDoc.save();

    return res.status(200).json({ message: 'Hive saved successfully' });
  } catch (error) {
    console.error('Error saving hive:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a hive
/*
router.patch('/:id', async (req, res) => {
  try {
    const hive = await HiveDocument.findOne({ hiveId: req.params.id });
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
*/

export default router;
