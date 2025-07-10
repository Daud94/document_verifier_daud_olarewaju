import { getChannel, VERIFY_DOCUMENT_QUEUE } from '../config/rabbitmq';
import { DocumentModel } from '../documents/documents.schema';
import { DocumentStatus } from '../documents/enums/documents-status.enum';
import { setWithTTL } from '../config/redis';

// Function to simulate delay
const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Function to randomly determine document status
const getRandomStatus = (): DocumentStatus => {
  return Math.random() > 0.5 ? DocumentStatus.VERIFIED : DocumentStatus.FAILED;
};

// Function to update document status
const updateDocumentStatus = async (documentId: string, status: DocumentStatus): Promise<void> => {
  try {
    // Update document status in database
    await DocumentModel.findByIdAndUpdate(documentId, { status });

    // Cache document status in Redis with default TTL (from environment variables)
    await setWithTTL(`document:${documentId}:status`, status);

    console.log(`Document ${documentId} marked as ${status} and cached in Redis`);
  } catch (error) {
    console.error(`Error updating document ${documentId}:`, error);
  }
};

// Start the worker
export const startDocumentVerifierWorker = async (): Promise<void> => {
  try {
    const channel = getChannel();

    console.log('Document verifier worker started');

    // Consume messages from the queue
    channel.consume(VERIFY_DOCUMENT_QUEUE, async (msg) => {
      if (msg) {
        try {
          // Parse the message
          const content = JSON.parse(msg.content.toString());
          const { documentId } = content;

          console.log(`Processing document: ${documentId}`);

          // Simulate a delay (2 seconds)
          await delay(2000);

          // Randomly mark the document as VERIFIED or FAILED
          const status = getRandomStatus();
          await updateDocumentStatus(documentId, status);

          // Acknowledge the message
          channel.ack(msg);
        } catch (error) {
          console.error('Error processing message:', error);
          // Reject the message and requeue it
          channel.nack(msg, false, true);
        }
      }
    });
  } catch (error) {
    console.error('Error starting document verifier worker:', error);
    throw error;
  }
};
