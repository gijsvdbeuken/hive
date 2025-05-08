import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import llmBatchesRoutes from './routes/llmBatchesRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

connectDB();

const app = express();
const port = process.env.SERVICE_LLM_BATCHES || null;

if (!port) {
  console.error('Error: The server port was not found in the environment variables.');
  process.exit(1);
}

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);
app.use('/api/batches', llmBatchesRoutes);

app.listen(port, () => {
  console.log(`service-llm-responses running at http://localhost:${port}`);
});
