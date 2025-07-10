import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DocumentController } from './documents.controller';
import { errorHandler } from '../middleware/error-handler';
import { DocumentStatus } from './enums/documents-status.enum';
import * as documentsService from './documents.service';
import * as rabbitmqConfig from '../config/rabbitmq';

// Mock the auth middleware
jest.mock('../middleware/auth.middleware', () => ({
  authMiddleware: (req, res, next) => {
    // Add a mock user to the request
    req.user = {
      userId: '507f1f77bcf86cd799439011', // Mock ObjectId
      role: 'user'
    };
    next();
  }
}));

// Mock the document service
jest.mock('./documents.service');
// Mock the RabbitMQ config
jest.mock('../config/rabbitmq');

describe('DocumentController', () => {
  let app: express.Express;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    // Setup Express app
    app = express();
    app.use(express.json());
    
    // Apply auth middleware to all routes
    app.use('/documents', DocumentController);
    
    // Add error handling middleware
    app.use(errorHandler);
    
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
  });

  describe('POST /documents', () => {
    it('should create a document and return 201', async () => {
      // Mock the createDocument function
      const mockDocument = {
        _id: '507f1f77bcf86cd799439011',
        user: '507f1f77bcf86cd799439011',
        documentType: 'passport',
        documentUrl: 'https://example.com/passport.pdf',
        status: DocumentStatus.PENDING
      };
      
      (documentsService.createDocument as jest.Mock).mockResolvedValue(mockDocument);
      (rabbitmqConfig.publishMessage as jest.Mock).mockResolvedValue(true);
      
      const documentData = {
        documentType: 'passport',
        documentUrl: 'https://example.com/passport.pdf'
      };
      
      const res = await request(app)
        .post('/documents')
        .send(documentData);
      
      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        success: true,
        message: 'Document created!'
      });
      
      // Verify service was called with correct parameters
      expect(documentsService.createDocument).toHaveBeenCalledWith(
        documentData,
        '507f1f77bcf86cd799439011'
      );
    });

    it('should return 400 for invalid document data', async () => {
      const invalidData = {
        // Missing required fields
      };
      
      const res = await request(app)
        .post('/documents')
        .send(invalidData);
      
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      (documentsService.createDocument as jest.Mock).mockRejectedValue(error);
      
      const documentData = {
        documentType: 'passport',
        documentUrl: 'https://example.com/passport.pdf'
      };
      
      const res = await request(app)
        .post('/documents')
        .send(documentData);
      
      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /documents', () => {
    it('should return documents for the user', async () => {
      const mockDocuments = [
        {
          _id: '507f1f77bcf86cd799439011',
          user: '507f1f77bcf86cd799439011',
          documentType: 'passport',
          documentUrl: 'https://example.com/passport.pdf',
          status: DocumentStatus.PENDING
        }
      ];
      
      const mockPagination = {
        totalDocs: 1,
        limit: 10,
        totalPages: 1,
        page: 1,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null
      };
      
      (documentsService.getAllCDocuments as jest.Mock).mockResolvedValue({
        documents: mockDocuments,
        pagination: mockPagination
      });
      
      const res = await request(app)
        .get('/documents')
        .query({ page: 1, limit: 10 });
      
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        success: true,
        message: 'Document fetched',
        data: mockDocuments,
        pagination: mockPagination
      });
      
      // Verify service was called with correct parameters
      expect(documentsService.getAllCDocuments).toHaveBeenCalledWith(
        expect.objectContaining({ page: '1', limit: '10' }),
        '507f1f77bcf86cd799439011'
      );
    });

    it('should handle service errors when fetching documents', async () => {
      const error = new Error('Service error');
      (documentsService.getAllCDocuments as jest.Mock).mockRejectedValue(error);
      
      const res = await request(app)
        .get('/documents')
        .query({ page: 1, limit: 10 });
      
      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /documents/:id', () => {
    it('should return a specific document', async () => {
      const mockDocument = {
        _id: '507f1f77bcf86cd799439011',
        user: '507f1f77bcf86cd799439011',
        documentType: 'passport',
        documentUrl: 'https://example.com/passport.pdf',
        status: DocumentStatus.PENDING
      };
      
      (documentsService.getDocument as jest.Mock).mockResolvedValue(mockDocument);
      
      const res = await request(app)
        .get('/documents/507f1f77bcf86cd799439011');
      
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        success: true,
        message: 'Document fetched',
        data: mockDocument
      });
      
      // Verify service was called with correct parameters
      expect(documentsService.getDocument).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        '507f1f77bcf86cd799439011'
      );
    });

    it('should handle service errors when fetching a specific document', async () => {
      const error = new Error('Service error');
      (documentsService.getDocument as jest.Mock).mockRejectedValue(error);
      
      const res = await request(app)
        .get('/documents/507f1f77bcf86cd799439011');
      
      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
    });
  });
});