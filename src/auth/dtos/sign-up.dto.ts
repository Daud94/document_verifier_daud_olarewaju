import Joi from "joi";

export const SignUpDto = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid('user', 'admin'),
    password: Joi.string().min(8).required()
})