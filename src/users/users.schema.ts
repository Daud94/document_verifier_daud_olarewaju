import {model, Schema} from "mongoose";
import {IUser} from "./IUser";

const schemaDefinition = {
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, required: true, enum: ['user', 'admin']},
} as const;
const usersSchema = new Schema(schemaDefinition, {timestamps: true});

export const UserModel = model('User', usersSchema, 'users'); // 'users' is the collection name in MongoDB