import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import llmHivesRoutes from './routes/llmHivesRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

connectDB();

const app = express();
const baseUrl = process.env.SERVICE_LLM_HIVES || null;
const port = new URL(baseUrl).port || 3003;

if (!baseUrl) {
  console.error('Error: The server port was not found in the environment variables.');
  process.exit(1);
}

app.use(express.json());
app.use(
  cors({
    origin: baseUrl,
    credentials: true,
  }),
);
app.use('/api/hives', llmHivesRoutes);

app.listen(port, () => {
  console.log(`service-llm-hives running at ${baseUrl}`);
});
