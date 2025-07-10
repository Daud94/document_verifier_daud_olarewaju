import {UserModel} from "./users.schema";

async function createUser(userData: any) {
    const user = new UserModel(userData);
    return await user.save();
}

async function getUserById(userId: string) {
    return await UserModel.findById(userId).exec();
}

async function getUserByEmail(email: string) {
    return await UserModel.findOne({email}).exec();
}

async function getAllUsers() {
    return await UserModel.find().exec();
}

async function updateUser(userId: string, userData: any) {
    return await UserModel.findByIdAndUpdate(userId, userData, {new: true}).exec();
}

async function deleteUser(userId: string) {
    return await UserModel.findByIdAndDelete(userId).exec();
}

export {
    createUser,
    getUserById,
    getUserByEmail,
    getAllUsers,
    updateUser,
    deleteUser
};