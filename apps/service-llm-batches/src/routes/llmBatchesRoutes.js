import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/save-active-hive', (req, res) => {
  const { activeHive } = req.body;

  if (!activeHive || typeof activeHive !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing "activeBatch" string' });
  }

  console.log(`✅ [llm-batches] Received active batch: ${activeHive}`);

  // TODO: store to DB

  res.status(200).json({ status: 'stored' });
});
export default router;
