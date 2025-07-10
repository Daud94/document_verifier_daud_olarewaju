import Joi from 'joi';

export const environmentSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development'),
    PORT: Joi.number().default(3000),
    CONNECTION_STRING: Joi.string().uri().required(),
    DATABASE: Joi.string().default('car-buddy'),
    JWT_SECRET: Joi.string().min(32).required(),
    JWT_EXPIRATION: Joi.string().default('1h'),
    SALT_ROUNDS: Joi.number().required(),
})