import {AbstractDocument} from "../config/abstract.document";

export interface IUser extends AbstractDocument {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'user' | 'dealer';
}