# Document Verifier

A Node.js application for document verification with asynchronous processing using RabbitMQ.

## Description

Document Verifier is a RESTful API service that allows users to submit documents for verification. The verification process is handled asynchronously using a worker pattern with RabbitMQ as the message broker.

## Technologies Used

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Programming language
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **RabbitMQ** - Message broker
- **Redis** - Caching layer
- **JWT** - Authentication
- **Jest** - Testing framework

## How to Run

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- RabbitMQ
- Redis

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```
PORT=3000
NODE_ENV=development
CONNECTION_STRING=mongodb://localhost:27017/document-verifier
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=1d
SALT_ROUNDS=10
DATABASE=document-verifier
REDIS_URL=redis://localhost:6379
REDIS_TTL=600  # TTL in seconds for document status cache (10 minutes)
```

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

### Running the Application

#### Development Mode

```
npm run dev
```

This starts the application with nodemon for automatic reloading during development.

#### Production Mode

1. Build the application:
   ```
   npm run build
   ```

2. Start the application:
   ```
   npm start
   ```

### Running Tests

```
npm test
```

## Architecture

### Folder Structure

```
src/
├── auth/           # Authentication related code
├── config/         # Configuration settings
├── documents/      # Document handling functionality
├── middleware/     # Express middleware
├── scripts/        # Utility scripts
├── types/          # TypeScript type definitions
├── users/          # User management
├── utils/          # Utility functions
├── validators/     # Input validation
├── workers/        # Background workers
├── app.ts          # Express application setup
└── main.ts         # Application entry point
```

### Service Layers

The application follows a layered architecture:

1. **Controllers** - Handle HTTP requests and responses
2. **Services** - Implement business logic
3. **Models** - Define data structures and database interactions
4. **Workers** - Process asynchronous tasks

### Document Verification Flow

1. User submits a document via the API
2. Document is saved to the database with status "PENDING"
3. A message is published to the RabbitMQ queue
4. The document verifier worker consumes the message
5. The worker processes the document and updates its status to "VERIFIED" or "FAILED"
6. The document status is cached in Redis with a 10-minute TTL
7. Subsequent requests for the document status check the Redis cache first before querying the database

## API Endpoints

### Authentication

- **POST /auth/sign-up** - Register a new user
- **POST /auth/login** - Login and get JWT token

### Documents

- **POST /documents** - Submit a new document for verification
- **GET /documents** - Get all documents (with pagination and filtering)
- **GET /documents/:id** - Get a specific document by ID

## Notes

- The RabbitMQ connection is configurable via the `RABBITMQ_URL` environment variable.
- The Redis connection is configurable via the `REDIS_URL` environment variable.
- The Redis cache TTL for document status is configurable via the `REDIS_TTL` environment variable (default: 600 seconds / 10 minutes).
- The document verification process is currently simulated (random success/failure). In a real-world scenario, this would be replaced with actual verification logic.
