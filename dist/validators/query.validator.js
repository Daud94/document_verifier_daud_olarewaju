"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = void 0;
const app_error_1 = require("../utils/app-error");
const Query = (schema) => {
    return async (req, res, next) => {
        try {
            const { error } = await schema.validate(req.query);
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
exports.Query = Query;
