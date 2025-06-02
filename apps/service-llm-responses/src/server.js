import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import llmResponsesRoutes from './routes/llmResponsesRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const baseUrl = process.env.SERVICE_LLM_RESPONSES || null;
const port = new URL(baseUrl).port || 3004;

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
app.use('/api/chat', llmResponsesRoutes);

app.listen(port, () => {
  console.log(`service-llm-responses running at ${baseUrl}`);
});
