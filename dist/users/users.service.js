"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const users_schema_1 = require("./users.schema");
class UsersService {
    async createUser(userData) {
        const user = new users_schema_1.UserModel(userData);
        return await user.save();
    }
    async getUserById(userId) {
        return await users_schema_1.UserModel.findById(userId).exec();
    }
    async getUserByEmail(email) {
        return await users_schema_1.UserModel.findOne({ email }).exec();
    }
    async getAllUsers() {
        return await users_schema_1.UserModel.find().exec();
    }
    async updateUser(userId, userData) {
        return await users_schema_1.UserModel.findByIdAndUpdate(userId, userData, { new: true }).exec();
    }
    async deleteUser(userId) {
        return await users_schema_1.UserModel.findByIdAndDelete(userId).exec();
    }
}
exports.UsersService = UsersService;
