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
- **JWT** - Authentication
- **Jest** - Testing framework

## How to Run

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- RabbitMQ

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

## API Endpoints

### Authentication

- **POST /auth/sign-up** - Register a new user
- **POST /auth/login** - Login and get JWT token

### Documents

- **POST /documents** - Submit a new document for verification
- **GET /documents** - Get all documents (with pagination and filtering)
- **GET /documents/:id** - Get a specific document by ID

## Notes

- The RabbitMQ connection is currently hardcoded to `amqp://localhost`. For production, this should be configurable via environment variables.
- The document verification process is currently simulated (random success/failure). In a real-world scenario, this would be replaced with actual verification logic.