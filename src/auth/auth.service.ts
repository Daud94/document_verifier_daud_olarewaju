import {AppError} from "../utils/app-error";
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {getUserByEmail, createUser} from "../users";
import {ConfigService} from "../config/config.service";

const configService = new ConfigService();

async function login(data: { email: string, password: string }) {
    const existingUser = await getUserByEmail(data.email);
    if (!existingUser) {
        throw AppError.notFound('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(data.password, existingUser.password);
    if (!isMatch) {
        throw AppError.badRequest('Invalid credentials');
    }

    const jwtSecret: string = configService.get('JWT_SECRET');
    const jwtExpiration = configService.get('JWT_EXPIRATION');


    const payload = {userId: existingUser._id, role: existingUser.role};
    const token = jwt.sign(payload, jwtSecret, {expiresIn: jwtExpiration});
    return {
        token,
        user: {
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            role: existingUser.role
        }
    }
}

async function signup(userData: { firstName: string, lastName: string, email: string, password: string }) {
    const existingUser = await getUserByEmail(userData.email);
    if (existingUser) {
        throw AppError.conflict('Email already exists');
    }
    const saltRounds = +configService.get('SALT_ROUNDS');
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    const newUser = {
        ...userData,
        password: hashedPassword
    };
    await createUser(newUser);

}

export {login, signup};