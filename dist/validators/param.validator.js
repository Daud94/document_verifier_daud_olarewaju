"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Param = void 0;
const Param = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.validate(req.params);
            next();
        }
        catch (e) {
            next(e);
        }
    };
};
exports.Param = Param;
