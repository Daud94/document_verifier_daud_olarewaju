"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt = __importStar(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const users_schema_1 = require("../users/users.schema");
// MongoDB connection string - replace with your actual connection string
const connectionString = process.env['CONNECTION_STRING'];
const database = process.env['DATABASE'];
const saltRounds = process.env['SALT_ROUNDS'] ? parseInt(process.env['SALT_ROUNDS']) : 10;
// Function to add admin user
async function addAdminUser() {
    try {
        // Connect to MongoDB
        await mongoose_1.default.connect(connectionString, { dbName: database });
        console.log('Connected to MongoDB');
        // Admin user details - modify these as needed
        const adminUserData = {
            firstName: 'Daud',
            lastName: 'Olarewaju',
            email: 'olarewajuyahyadaud+1@gmail.com',
            password: await bcrypt.hash('admin123', saltRounds),
            role: 'admin'
        };
        // Check if admin user already exists
        const existingUser = await users_schema_1.UserModel.findOne({
            email: adminUserData.email
        });
        if (existingUser) {
            console.log('Admin user already exists with this username or email');
            return;
        }
        const adminUser = new users_schema_1.UserModel(adminUserData);
        await adminUser.save();
        console.log('Admin user created successfully:');
    }
    catch (error) {
        console.error('Error creating admin user:', error.message);
        if (error.code === 11000) {
            console.error('Duplicate key error: Username or email already exists');
        }
    }
    finally {
        // Close the database connection
        await mongoose_1.default.connection.close();
        console.log('Database connection closed');
    }
}
// Execute the function
addAdminUser();
