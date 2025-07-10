import amqp from 'amqplib';
import { ConfigService } from './config.service';

const configService = new ConfigService();
let connection: amqp.ChannelModel
let channel: amqp.Channel

export const VERIFY_DOCUMENT_QUEUE = 'verify_document';

export const connectRabbitMQ = async (): Promise<void> => {
  try {
    // Get RabbitMQ URL from environment variables
    const rabbitmqUrl = configService.get('RABBITMQ_URL') || 'amqp://localhost';

    // Connect to RabbitMQ server
    connection = await amqp.connect(rabbitmqUrl);
    channel = await connection!.createChannel();

    // Ensure the queue exists
    await channel.assertQueue(VERIFY_DOCUMENT_QUEUE, {
      durable: true
    });

    console.log('Connected to RabbitMQ at', rabbitmqUrl);
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
    throw error;
  }
};

export const getChannel = (): amqp.Channel => {
  if (!channel) {
    throw new Error('RabbitMQ channel not initialized');
  }
  return channel;
};

export const publishMessage = async (queue: string, message: any): Promise<boolean> => {
  try {
    if (!channel) {
      throw new Error('RabbitMQ channel not initialized');
    }

    return channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true
    });
  } catch (error) {
    console.error('Error publishing message:', error);
    throw error;
  }
};

export const closeConnection = async (): Promise<void> => {
  try {
    if (channel) {
      await channel.close();
    }
    if (connection) {
      await connection.close();
    }
    console.log('Closed RabbitMQ connection');
  } catch (error) {
    console.error('Error closing RabbitMQ connection:', error);
    throw error;
  }
};
