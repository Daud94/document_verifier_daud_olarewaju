import {NextFunction, Response, Request} from "express";
import {AppError} from "../utils/app-error";

export const Query = (schema:any) => {
    return async (req:Request, res:Response, next:NextFunction) => {
        try {
            const {error} = await schema.validate(req.query)
            if (error) {
                throw AppError.badRequest(error.message);
            }
            next()
        } catch (e) {
            next(e)
        }
    }
}
