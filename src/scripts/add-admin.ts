import mongoose from "mongoose";
import * as bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();
import {UserModel} from "../users/users.schema";
// MongoDB connection string - replace with your actual connection string
const connectionString = process.env['CONNECTION_STRING']
const database = process.env['DATABASE']
const saltRounds = process.env['SALT_ROUNDS'] ? parseInt(process.env['SALT_ROUNDS']) : 10;

// Function to add admin user
async function addAdminUser() {
    try {
        // Connect to MongoDB
        await mongoose.connect(<string>connectionString, {dbName: database});
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
        const existingUser = await UserModel.findOne({
            email: adminUserData.email
        });

        if (existingUser) {
            console.log('Admin user already exists with this username or email');
            return;
        }

        const adminUser = new UserModel(adminUserData);
        await adminUser.save();

        console.log('Admin user created successfully:');


    } catch (error:any) {
        console.error('Error creating admin user:', error.message);

        if (error.code === 11000) {
            console.error('Duplicate key error: Username or email already exists');
        }
    } finally {
        // Close the database connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

// Execute the function
addAdminUser();