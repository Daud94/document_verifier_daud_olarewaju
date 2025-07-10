"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const mongoose_1 = require("mongoose");
const schemaDefinition = {
    user: { type: mongoose_1.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
    dealer: { type: mongoose_1.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model for dealer
    car: { type: mongoose_1.Types.ObjectId, ref: 'Car', required: true }, // Reference to the Car model
    orderDate: { type: Date, required: true, default: Date.now },
    deliveryDate: { type: Date, required: false },
    paymentMethod: { type: String, required: false, enum: ['credit_card', 'paypal', 'bank_transfer'] },
    status: { type: String, required: true, enum: ['pending', 'confirmed', 'cancelled', 'delivered'], default: 'pending' },
    price: { type: Number, required: true },
    notes: { type: String, required: false },
};
const ordersSchema = new mongoose_1.Schema(schemaDefinition, { timestamps: true });
ordersSchema.index({ orderDate: -1 }); // Index for order date for faster queries
exports.OrderModel = (0, mongoose_1.model)('Order', ordersSchema, 'orders'); // 'orders' is the collection name in MongoDB
