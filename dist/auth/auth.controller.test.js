"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
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
const auth_controller_1 = require("./auth.controller");
const error_handler_1 = require("../middleware/error-handler");
describe('AuthController', () => {
    let app;
    beforeAll(() => {
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use('/auth', auth_controller_1.AuthController);
        // Add your actual error handling middleware
        // @ts-ignore
        app.use(error_handler_1.errorHandler);
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
                firstName: 'Test',
                lastName: 'User',
                email: 'testuser@example.com',
                role: 'user',
                password: 'Password'
            };
            const res = await (0, supertest_1.default)(app)
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
        it('should return 400 when registration fails', async () => {
            // For void methods, mock rejection with appropriate error
            const error = new Error('Email already exists');
            mockAuthService.register.mockRejectedValue(error);
            const res = await (0, supertest_1.default)(app)
                .post('/auth/register')
                .send({ email: 'test@example.com', password: 'Password123!' });
            // Then check the response (adjust based on what you see in console)
            expect(res.status).toBe(400); // or 500, depending on your error handling
            expect(res.body).toMatchObject({
                success: false,
                message: expect.any(String),
            });
        });
        it('should return 409 when email already exists', async () => {
            // Create error that matches what your service throws
            // Option 1: If your service throws AppError
            const error = new Error('Email already exists');
            mockAuthService.register.mockRejectedValue(error);
            const userData = {
                firstName: 'Test',
                lastName: 'User',
                email: 'testuser@example.com',
                role: 'user',
                password: 'Password'
            };
            const res = await (0, supertest_1.default)(app)
                .post('/auth/register')
                .send(userData);
            expect(mockAuthService.register).toHaveBeenCalledWith(userData);
            expect(res.status).toBe(409);
            expect(res.body).toEqual({
                success: false,
                message: 'Email already exists',
            });
        });
        it('should return 500 for unexpected errors', async () => {
            // Error without statusCode defaults to 500
            const error = new Error('Database connection failed');
            mockAuthService.register.mockRejectedValue(error);
            const res = await (0, supertest_1.default)(app)
                .post('/auth/register')
                .send({ email: 'test@example.com', password: 'Password123!' });
            expect(res.status).toBe(500);
            expect(res.body).toEqual({
                success: false,
                message: 'Internal server error', // Your middleware changes 500 messages
            });
        });
        it('should return 500 for database errors', async () => {
            // Mock database or unexpected errors
            const error = new Error('Database connection failed');
            error.name = 'DatabaseError';
            mockAuthService.register.mockRejectedValue(error);
            const res = await (0, supertest_1.default)(app)
                .post('/auth/register')
                .send({ email: 'test@example.com', password: 'Password123!' });
            expect(res.status).toBe(500);
            expect(res.body).toMatchObject({
                success: false,
                message: expect.any(String),
            });
        });
        it('should return 400 for invalid input', async () => {
            const res = await (0, supertest_1.default)(app)
                .post('/auth/register')
                .send({ email: 'invalid-email' }); // Missing password, invalid email
            expect(res.status).toBe(400);
            expect(res.body).toMatchObject({
                success: false,
                message: expect.any(String),
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
            const res = await (0, supertest_1.default)(app)
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
            const error = new Error('Invalid credentials');
            error.name = 'AuthenticationError';
            mockAuthService.login.mockRejectedValue(error);
            const res = await (0, supertest_1.default)(app)
                .post('/auth/login')
                .send({ email: 'test@example.com', password: 'wrongpassword' });
            expect(res.status).toBe(401);
            expect(res.body).toMatchObject({
                success: false,
                message: expect.any(String),
            });
        });
        it('should return 400 for missing credentials', async () => {
            const res = await (0, supertest_1.default)(app)
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
            const res = await (0, supertest_1.default)(app)
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
            const res = await (0, supertest_1.default)(app)
                .post('/auth/login')
                .set('Content-Type', 'application/json')
                .send('{ invalid json }');
            expect(res.status).toBe(400);
        });
        it('should handle missing content-type', async () => {
            const res = await (0, supertest_1.default)(app)
                .post('/auth/register')
                .send('email=test@example.com&password=Password123!');
            // Should either parse as form data or return 400
            expect([200, 201, 400]).toContain(res.status);
        });
    });
});
