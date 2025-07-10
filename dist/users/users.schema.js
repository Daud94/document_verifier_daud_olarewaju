"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const schemaDefinition = {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['user', 'dealer'] },
};
const usersSchema = new mongoose_1.Schema(schemaDefinition, { timestamps: true });
exports.UserModel = (0, mongoose_1.model)('User', usersSchema, 'users'); // 'users' is the collection name in MongoDB
