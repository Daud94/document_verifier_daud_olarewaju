# Car Buddy

Car Buddy is a Node.js backend API for managing car listings, user authentication, and orders. Built with Express, TypeScript, and MongoDB, it supports dealers and buyers with secure authentication and robust validation.

## Features
- User registration and login (JWT-based authentication)
- Car CRUD operations (add, update, get, list)
- Order creation and management
- Role-based access (dealer, buyer)
- Input validation with Joi
- Error handling middleware
- Comprehensive testing with Jest and Supertest

## Project Structure
```
src/
  app.ts                # Express app setup
  main.ts               # Entry point
  auth/                 # Auth controllers, services, DTOs
  cars/                 # Car controllers, services, DTOs
  orders/               # Order controllers, services, DTOs
  users/                # User models and services
  middleware/           # Auth and error middleware
  config/               # Config and DB connection
  utils/                # App error utilities
  validators/           # Request body/query validators
```

## Getting Started

### Prerequisites
- Node.js >= 18
- npm
- MongoDB instance (local or cloud)

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/Daud94/car-buddy.git
   cd car-buddy
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the root with:
   ```env
    PORT=your-port-number
    NODE_ENV=development
    CONNECTION_STRING=your-mongodb-connection-string
    JWT_SECRET=your-jwt-secret
    JWT_EXPIRATION=your-jwt-expiration-time
    SALT_ROUNDS=your-salt-rounds
    DATABASE=car-buddy
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```

### Build and Run
```sh
npm run build
npm start
```

### Run Tests
```sh
npm test
```

## API Documentation

### Auth
- **POST /auth/register** — Register a new user
  - Body: `{ firstName, lastName, email, password, role }`
- **POST /auth/login** — Login and receive JWT
  - Body: `{ email, password }`

### Cars
- **POST /cars/add** — Add a new car (dealer only)
- **GET /cars/all** — List all cars (dealers see their own, supports query params)
- **GET /cars/:id/get** — Get car by ID
- **PATCH /cars/:id/update** — Update car (dealer only)
- **DELETE /cars/:id/delete** — Delete car (dealer only)

### Orders
- **POST /orders/create** — Create a new order
  - Body: `{ carId, dealerId, note(optional) }`
- **GET /orders/all** — List orders (dealers see all, users see their own, supports query params)

### Users
- **GET /users/:id** — Get user profile

## Usage Example

### 1. Register a New User
Request:
```http
POST /auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "dealer" // or "buyer"
}
```
Response:
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "dealer"
  }
}
```

### 2. Login
Request:
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```
Response:
```json
{
  "token": "<jwt-token>"
}
```

### 3. Use JWT Token for Authenticated Requests
Add the following header to all protected endpoints:
```http
Authorization: Bearer <jwt-token>
```

### 4. Add a Car (Dealer Only)
Request:
```http
POST /cars/add
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "make": "Toyota",
  "model": "Corolla",
  "year": 2022,
  "price": 15000
}
```
Response:
```json
{
  "message": "Car added successfully",
  "car": {
    "_id": "...",
    "make": "Toyota",
    "model": "Corolla",
    "year": 2022,
    "price": 15000,
    "dealerId": "..."
  }
}
```

### 5. Create an Order (Buyer)
Request:
```http
POST /orders/create
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "carId": "<car-id>",
  "dealerId": "<dealer-id>",
  "note": "Interested in quick purchase."
}
```
Response:
```json
{
  "message": "Order created successfully",
  "order": {
    "_id": "...",
    "carId": "<car-id>",
    "dealerId": "<dealer-id>",
    "buyerId": "...",
    "note": "Interested in quick purchase."
  }
}
```

## Contributing
Pull requests are welcome. For major changes, open an issue first.

## License
ISC

