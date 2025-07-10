import {NextFunction, Response, Request} from "express";
import Joi from "joi";
import {AppError} from "../utils/app-error";

export const Body = (schema: Joi.AnySchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { error } = schema.validate(req.body);
            if (error) {
                throw AppError.badRequest(error.message);
            }
            next();
        } catch (e) {
            next(e);
        }
    }
}