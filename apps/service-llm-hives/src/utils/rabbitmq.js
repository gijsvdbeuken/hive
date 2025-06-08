import amqp from 'amqplib';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { deleteHivesByOwner } from './hiveActions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

let channel;

export async function startRabbitMQConsumer() {
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

  const { queue } = await channel.assertQueue('', { exclusive: true });
  await channel.bindQueue(queue, 'user.events', '');

  console.log(`[RabbitMQ] Waiting for messages on queue: ${queue}`);

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      try {
        const content = JSON.parse(msg.content.toString());
        console.log(`[RabbitMQ] Received event:`, content);

        if (content.event === 'USER_DELETED') {
          console.log(`[Consumer] Deleting hives for userId=${content.userId}`);
          await deleteHivesByOwner(content.userId);
          console.log(`[MongoDB] Deleted hives for userId=${content.userId}`);
        }
        channel.ack(msg);
      } catch (err) {
        console.error('[Consumer Error]', err);
      }
    }
  });
}
