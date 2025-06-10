import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import llmResponsesRoutes from './routes/llmResponsesRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting service-llm-responses...');
console.log('__dirname:', __dirname);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('Environment variables loaded');
console.log('SERVICE_LLM_RESPONSES:', process.env.SERVICE_LLM_RESPONSES);
console.log('PORT:', process.env.PORT);

const app = express();
const baseUrl = process.env.SERVICE_LLM_RESPONSES || null;
const port = process.env.PORT || 3004;

console.log('baseUrl:', baseUrl);
console.log('port:', port);

if (!baseUrl) {
  console.error('Error: The server port was not found in the environment variables.');
  process.exit(1);
}

console.log('Setting up middleware...');

app.use(express.json());
app.use(
  cors({
    origin: baseUrl,
    credentials: true,
  }),
);

console.log('Setting up routes...');
app.use('/api/chat', llmResponsesRoutes);

console.log('Starting server...');
app.listen(port, () => {
  console.log(`service-llm-responses running at ${baseUrl}`);
  console.log('Server is listening and ready for requests');
});

console.log('Server setup complete');
