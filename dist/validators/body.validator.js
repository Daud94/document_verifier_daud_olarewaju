"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Body = void 0;
const app_error_1 = require("../utils/app-error");
const Body = (schema) => {
    return async (req, res, next) => {
        try {
            const { error } = schema.validate(req.body);
            if (error) {
                throw app_error_1.AppError.badRequest(error.message);
            }
            next();
        }
        catch (e) {
            next(e);
        }
    };
};
exports.Body = Body;
