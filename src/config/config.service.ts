import dotenv from 'dotenv';
import {environmentSchema} from './enviroment.validate';
import {AppError} from '../utils/app-error';
import lodash from 'lodash';

dotenv.config();
const env = lodash.pick(process.env, [
    'PORT',
    'NODE_ENV',
    'CONNECTION_STRING',
    'JWT_SECRET',
    'JWT_EXPIRATION',
    'SALT_ROUNDS',
    'DATABASE'
]);

export class ConfigService {
    private config: { [key: string]: any } = {};

    constructor() {
        this.loadConfig();
    }

    private loadConfig(): void {
        const {error, value} = environmentSchema.validate(env);
        if (error) {
            throw AppError.badRequest(`Invalid configuration: ${error.message}`);
        }
        this.config = value;
    }

    get(key: string): any {
        return this.config[key];
    }
}
