/* es-lint-disable */

/**
 * This file represents the main entry point of the SmartAssChat server application.
 * It sets up an Express server, WebSocket server, and handles incoming client requests.
 * The server listens on port 3000 and provides endpoints for login and sending messages.
 * It also manages user authentication, chat service, and history service.
 */

import express, { Express, Request, Response } from 'express'
import { createServer } from 'http'

const port = 4000


const app: Express = express()

const server = createServer(app)


/**
 * Handles the root endpoint of the server.
 * @param req - The request object.
 * @param res - The response object.
 */
app.get('/', (req: Request, res: Response) => {
  res.send('Server 1.0')
})

server.listen(port, () => {
  console.info(`⚡️ Server is running at http://localhost:${port}`)
})

import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'microservice-1-'+Math.random(),
  brokers: ['kafka:9092'],
});

const topic = 'user-events';

// Kafka Consumer
const consumer = kafka.consumer({ groupId: 'microservice-1' });
const producer = kafka.producer();


// generates a consumer that lags behing
const slowerConsumer = kafka.consumer({ groupId: 'microservice-2' });

const run = async () => {
  await producer.connect();
  await consumer.connect();
  await slowerConsumer.connect();

  // Subscribe to the topic
  await consumer.subscribe({ topic, fromBeginning: true });
  await slowerConsumer.subscribe({ topic, fromBeginning: true });

  // Process incoming messages
  consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log("normal",{
        partition,
        offset: message.offset,
        value: message.value?.toString(),
      });
    },
  });

  slowerConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      await new Promise((resolve) => setTimeout(resolve, 10_000));
      console.log("slower", {
        partition,
        offset: message.offset,
        value: message.value?.toString(),
      });
    },
  });

  // Produce a message every 10 seconds
  setInterval(async () => {
    await producer.send({
      topic,
      messages: [{ value: `Event at ${new Date().toISOString()}` }],
    });
    console.log('Produced an event');
  }, 5_000);
};

run().catch(console.error);
