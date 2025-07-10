import request from 'supertest';
import express from 'express';

// Import your error handler

// Create mock service instance
const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
};

// Mock AuthService before importing controller
jest.mock('./auth.service', () => ({
    AuthService: jest.fn().mockImplementation(() => mockAuthService),
}));

// Import controller after mocking
import { AuthController } from './auth.controller';
import {errorHandler} from "../middleware/error-handler";
import {AppError} from "../utils/app-error";

describe('AuthController', () => {
    let app: express.Express;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use('/auth', AuthController);

        // Add your actual error handling middleware
        //@ts-ignore
        app.use(errorHandler);
    });

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    describe('POST /auth/register', () => {
        it('should register a user and return 201', async () => {
            // Setup mock to resolve successfully
            mockAuthService.register.mockResolvedValue(undefined);
            const userData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'johndoe@example.com',
                role: 'user',
                password: '12345678',
            };
            const res = await request(app)
                .post('/auth/register')
                .send(userData);

            expect(res.status).toBe(201);
            expect(res.body).toEqual({
                success: true,
                message: 'Registration successful',
            });

            // Verify service was called with correct parameters
            expect(mockAuthService.register).toHaveBeenCalledTimes(1);
            expect(mockAuthService.register).toHaveBeenCalledWith(userData);
        });


        it('should return 409 when email already exists', async () => {
            // Create error that matches what your service throws
            // Option 1: If your service throws AppError
            const error = new AppError('Email already exists', 409);

            mockAuthService.register.mockRejectedValue(error);
            const userData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'johndoe@example.com',
                role: 'user',
                password: '12345678',
            };
            const res = await request(app)
                .post('/auth/register')
                .send(userData);

            expect(res.status).toBe(409);
            expect(res.body).toEqual({
                success: false,
                message: 'Email already exists',
            });
        });

    });

    describe('POST /auth/login', () => {
        it('should login a user and return 200 with token', async () => {
            // Setup mock to resolve with user data
            const mockResponse = {
                user: { id: '1', email: 'test@example.com' },
                token: 'mocked-jwt-token',
            };
            mockAuthService.login.mockResolvedValue(mockResponse);

            const loginData = { email: 'test@example.com', password: 'Password123!' };

            const res = await request(app)
                .post('/auth/login')
                .send(loginData);

            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({
                success: true,
                message: 'Login successful',
                data: { id: '1', email: 'test@example.com' },
                authToken: 'mocked-jwt-token',
            });

            // Verify service was called with correct parameters
            expect(mockAuthService.login).toHaveBeenCalledTimes(1);
            expect(mockAuthService.login).toHaveBeenCalledWith(loginData);
        });

        it('should return 401 for invalid credentials', async () => {
            // Setup mock to reject with authentication error
            const error = new AppError('Invalid credentials', 400);
            mockAuthService.login.mockRejectedValue(error);

            const res = await request(app)
                .post('/auth/login')
                .send({ email: 'test@example.com', password: 'wrongpassword' });

            expect(res.status).toBe(400);
            expect(res.body).toMatchObject({
                success: false,
                message: expect.any(String),
            });
        });

        it('should return 400 for missing credentials', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({ email: 'test@example.com' }); // Missing password

            expect(res.status).toBe(400);
            expect(res.body).toMatchObject({
                success: false,
                message: expect.any(String),
            });
        });

        it('should return 500 for unexpected errors', async () => {
            // Setup mock to reject with unexpected error
            const error = new Error('Database connection failed');
            mockAuthService.login.mockRejectedValue(error);

            const res = await request(app)
                .post('/auth/login')
                .send({ email: 'test@example.com', password: 'Password123!' });

            expect(res.status).toBe(500);
            expect(res.body).toMatchObject({
                success: false,
                message: expect.any(String),
            });
        });
    });

    describe('Error handling', () => {
        it('should handle malformed JSON', async () => {
            const res = await request(app)
                .post('/auth/login')
                .set('Content-Type', 'application/json')
                .send('{ invalid json }');

            expect(res.status).toBe(400);
        });
    });
});