import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './db.js';
import { connectRabbitMQ } from './utils/rabbitmq.js';

connectRabbitMQ().catch(console.error);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

await connectDB();

const app = express();
const baseUrl = process.env.SERVICE_USER;
const port = new URL(baseUrl).port || 3002;

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

app.use('/api/users', userRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'service-llm-user',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.listen(port, () => {
  console.log(`service-user running at ${baseUrl}`);
});
