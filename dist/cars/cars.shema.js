"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarModel = void 0;
const mongoose_1 = require("mongoose");
const schemaDefinition = {
    user: { type: mongoose_1.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    mileage: { type: Number, required: true },
    vin: { type: String, required: true, unique: true },
    color: { type: String, required: true },
    description: { type: String, required: false },
    status: { type: String, required: true, enum: ['sold', 'available', 'ordered'], default: 'available' },
}; // Define the schema definition with TypeScript's 'as const' for better type inference
const carsSchema = new mongoose_1.Schema(schemaDefinition, { timestamps: true });
carsSchema.index({ make: 'text', model: 'text', color: 'text', description: 'text' }); // Full-text search index
exports.CarModel = (0, mongoose_1.model)('Car', carsSchema, 'cars'); // 'cars' is the collection name in MongoDB
