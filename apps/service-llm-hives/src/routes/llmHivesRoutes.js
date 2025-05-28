import express from 'express';
import dotenv from 'dotenv';
import { Hives } from '../models/hive.js';

dotenv.config();

const router = express.Router();

// Get all hives
router.get('/:ownerId', async (req, res) => {
  try {
    const { ownerId } = req.params;

    if (!ownerId) {
      return res.status(400).json({ error: 'Missing ownerId' });
    }

    const userDoc = await Hives.findOne({ ownerId });

    if (!userDoc || !userDoc.hives) {
      return res.status(200).json({ hives: [] });
    }

    // Format data for the frontend
    const formattedHives = userDoc.hives.map((hive) => ({
      id: hive.id,
      title: hive.id, // Assuming `id` is used as title — adjust if needed
      models: Array.isArray(hive.large_language_models) ? hive.large_language_models.filter(Boolean) : [],
    }));

    return res.status(200).json({ hives: formattedHives });
  } catch (err) {
    console.error('Error fetching hives:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new hive
router.post('/', async (req, res) => {
  try {
    console.log('Trying to create a new Hive...');
    const { ownerId, hiveId, largeLanguageModels } = req.body;

    // Validate required fields
    if (!ownerId || !hiveId || !largeLanguageModels || !Array.isArray(largeLanguageModels)) {
      return res.status(400).json({ error: 'Missing or invalid fields' });
    }

    // Filter out empty/falsy values
    const filteredModels = largeLanguageModels.filter(Boolean);

    // Check if we have at least 2 models (required by schema)
    if (filteredModels.length < 2) {
      return res.status(400).json({ error: 'A hive must contain at least 2 language models' });
    }

    // Try to find existing document for this user
    let userDoc = await Hives.findOne({ ownerId });

    const now = new Date();

    // Create new hive object
    const newHive = {
      id: hiveId,
      createdAt: now,
      updatedAt: now,
      large_language_models: filteredModels,
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
      // Check for duplicate hive IDs
      const existingHive = userDoc.hives.find((hive) => hive.id === hiveId);
      if (existingHive) {
        return res.status(400).json({ error: 'A hive with this ID already exists' });
      }

      // Append new hive
      userDoc.hives.push(newHive);
      userDoc.updatedAt = now;
    }

    await userDoc.save();

    return res.status(201).json({
      message: 'Hive created successfully',
      hive: {
        id: newHive.id,
        title: newHive.id,
        models: newHive.large_language_models,
      },
    });
  } catch (error) {
    console.error('Error saving hive:', error);

    // Handle mongoose validation errors specifically
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.message,
      });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a specific hive by ownerId and hiveId
router.delete('/:ownerId/:hiveId', async (req, res) => {
  try {
    const { ownerId, hiveId } = req.params;

    if (!ownerId || !hiveId) {
      return res.status(400).json({ error: 'Missing ownerId or hiveId' });
    }

    const userDoc = await Hives.findOne({ ownerId });

    if (!userDoc) {
      return res.status(404).json({ error: 'User not found' });
    }

    const hiveIndex = userDoc.hives.findIndex((hive) => hive.id === hiveId);

    if (hiveIndex === -1) {
      return res.status(404).json({ error: 'Hive not found' });
    }

    userDoc.hives.splice(hiveIndex, 1);
    userDoc.updatedAt = new Date();

    await userDoc.save();

    return res.status(200).json({ message: 'Hive deleted successfully' });
  } catch (err) {
    console.error('Error deleting hive:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
