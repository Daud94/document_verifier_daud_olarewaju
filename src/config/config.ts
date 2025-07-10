import mongoose from 'mongoose';
import {ConfigService} from "./config.service";
export const connectDatabase = async () => {
    try {
        const configService = new ConfigService();
        const connectionString: string = configService.get('CONNECTION_STRING');
        await mongoose.connect(connectionString, {
            dbName: configService.get('DATABASE'),
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1); // Exit the process with failure
    }
}