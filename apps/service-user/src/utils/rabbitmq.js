import amqp from 'amqplib';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

let channel;

export async function connectRabbitMQ() {
  let connectionString;
  if (process.env.NODE_ENV === 'development') {
    connectionString = 'amqp://guest:guest@localhost:5672';
  } else {
    const host = process.env.RABBITMQ_HOST || 'localhost';
    const port = process.env.RABBITMQ_PORT || '5672';
    const user = process.env.RABBITMQ_USER || 'guest';
    const pass = process.env.RABBITMQ_PASS || 'guest';

    connectionString = `amqp://${user}:${pass}@${host}:${port}`;
  }
  const connection = await amqp.connect(connectionString);
  channel = await connection.createChannel();

  await channel.assertExchange('user.events', 'fanout', { durable: false });

  console.log('[RabbitMQ] Connected and exchange ready');
}

export function publishUserDeleted(userId) {
  if (!channel) {
    throw new Error('RabbitMQ channel not initialized');
  }

  const message = JSON.stringify({ event: 'USER_DELETED', userId });
  channel.publish('user.events', '', Buffer.from(message));
  console.log(`[RabbitMQ] Sent USER_DELETED event for userId=${userId}`);
}
