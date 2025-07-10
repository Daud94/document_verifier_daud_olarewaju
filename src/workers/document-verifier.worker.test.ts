import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { startDocumentVerifierWorker } from './document-verifier.worker';
import { DocumentModel } from '../documents/documents.schema';
import { DocumentStatus } from '../documents/enums/documents-status.enum';
import * as rabbitmqConfig from '../config/rabbitmq';

// Mock the RabbitMQ config
jest.mock('../config/rabbitmq', () => {
  const mockChannel = {
    consume: jest.fn(),
    ack: jest.fn(),
    nack: jest.fn()
  };
  
  return {
    getChannel: jest.fn().mockReturnValue(mockChannel),
    VERIFY_DOCUMENT_QUEUE: 'verify_document'
  };
});

// Mock the mongoose model
jest.mock('../documents/documents.schema', () => {
  return {
    DocumentModel: {
      findByIdAndUpdate: jest.fn()
    }
  };
});

describe('Document Verifier Worker', () => {
  let mongoServer: MongoMemoryServer;
  
  beforeAll(async () => {
    // Setup in-memory MongoDB
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });
  
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the mock implementation of setTimeout
    jest.useRealTimers();
  });
  
  it('should start the worker and consume messages', async () => {
    await startDocumentVerifierWorker();
    
    const mockChannel = rabbitmqConfig.getChannel();
    
    expect(mockChannel.consume).toHaveBeenCalledWith(
      'verify_document',
      expect.any(Function)
    );
  });
  
  it('should process a message and update document status', async () => {
    // Mock the setTimeout to execute immediately
    jest.useFakeTimers();
    
    // Setup the consume callback capture
    let consumeCallback: Function;
    const mockChannel = rabbitmqConfig.getChannel();
    (mockChannel.consume as jest.Mock).mockImplementation((queue, callback) => {
      consumeCallback = callback;
    });
    
    // Start the worker
    await startDocumentVerifierWorker();
    
    // Create a mock message
    const mockDocumentId = '507f1f77bcf86cd799439011';
    const mockMessage = {
      content: Buffer.from(JSON.stringify({ documentId: mockDocumentId }))
    };
    
    // Mock the findByIdAndUpdate to resolve
    (DocumentModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({
      _id: mockDocumentId,
      status: DocumentStatus.VERIFIED
    });
    
    // Call the consume callback with the mock message
    await consumeCallback(mockMessage);
    
    // Fast-forward time to execute the delay
    jest.runAllTimers();
    
    // Verify document status was updated
    expect(DocumentModel.findByIdAndUpdate).toHaveBeenCalledWith(
      mockDocumentId,
      { status: expect.any(String) }
    );
    
    // Verify message was acknowledged
    expect(mockChannel.ack).toHaveBeenCalledWith(mockMessage);
  });
  
  it('should handle errors when processing a message', async () => {
    // Setup the consume callback capture
    let consumeCallback: Function;
    const mockChannel = rabbitmqConfig.getChannel();
    (mockChannel.consume as jest.Mock).mockImplementation((queue, callback) => {
      consumeCallback = callback;
    });
    
    // Start the worker
    await startDocumentVerifierWorker();
    
    // Create a mock message with invalid content
    const mockMessage = {
      content: Buffer.from('invalid json')
    };
    
    // Call the consume callback with the invalid message
    await consumeCallback(mockMessage);
    
    // Verify message was rejected and requeued
    expect(mockChannel.nack).toHaveBeenCalledWith(mockMessage, false, true);
  });
  
  it('should handle errors when updating document status', async () => {
    // Mock the setTimeout to execute immediately
    jest.useFakeTimers();
    
    // Setup the consume callback capture
    let consumeCallback: Function;
    const mockChannel = rabbitmqConfig.getChannel();
    (mockChannel.consume as jest.Mock).mockImplementation((queue, callback) => {
      consumeCallback = callback;
    });
    
    // Start the worker
    await startDocumentVerifierWorker();
    
    // Create a mock message
    const mockDocumentId = '507f1f77bcf86cd799439011';
    const mockMessage = {
      content: Buffer.from(JSON.stringify({ documentId: mockDocumentId }))
    };
    
    // Mock the findByIdAndUpdate to reject
    const error = new Error('Database error');
    (DocumentModel.findByIdAndUpdate as jest.Mock).mockRejectedValue(error);
    
    // Call the consume callback with the mock message
    await consumeCallback(mockMessage);
    
    // Fast-forward time to execute the delay
    jest.runAllTimers();
    
    // Verify message was rejected and requeued
    expect(mockChannel.nack).toHaveBeenCalledWith(mockMessage, false, true);
  });
});