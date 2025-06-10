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
const port = process.env.PORT || 3004;

console.log('Starting with baseUrl:', baseUrl, 'port:', port);

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

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`service-llm-responses running at ${baseUrl}`);
  console.log('Server is ready and listening on port', port);
});

// Keep the process alive
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

console.log('Setup complete, server should be running...');
