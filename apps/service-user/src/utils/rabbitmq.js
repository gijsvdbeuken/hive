import amqp from 'amqplib';

let channel;

export async function connectRabbitMQ() {
  const connection = await amqp.connect('amqp://localhost:5672');
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
