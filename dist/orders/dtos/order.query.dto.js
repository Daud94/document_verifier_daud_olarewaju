"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderQueryDto = void 0;
const joi_1 = __importDefault(require("joi"));
exports.OrderQueryDto = joi_1.default.object({
    orderId: joi_1.default.string().optional(),
    userId: joi_1.default.string().optional(),
    carId: joi_1.default.string().optional(),
    status: joi_1.default.string().valid('pending', 'completed', 'cancelled').optional(),
    fromDate: joi_1.default.date().optional(),
    toDate: joi_1.default.date().optional(),
    limit: joi_1.default.number().integer().min(1).max(100).default(10).optional(),
    page: joi_1.default.number().integer().min(1).default(1).optional(),
});
