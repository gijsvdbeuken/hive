// utils/rabbitmq.js
import amqp from 'amqplib';
import { deleteHivesByOwner } from './hiveActions.js';

export async function startRabbitMQConsumer() {
  const connection = await amqp.connect('amqp://localhost:5672');
  const channel = await connection.createChannel();

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
