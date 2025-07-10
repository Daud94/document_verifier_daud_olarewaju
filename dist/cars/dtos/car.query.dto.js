"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarQueryDto = void 0;
const joi_1 = __importDefault(require("joi"));
exports.CarQueryDto = joi_1.default.object({
    search: joi_1.default.string().min(2).max(100).optional(),
    make: joi_1.default.string().min(2).max(50).optional(),
    model: joi_1.default.string().min(2).max(50).optional(),
    minYear: joi_1.default.number().integer().min(1886).max(new Date().getFullYear()).optional(),
    maxYear: joi_1.default.number().integer().min(1886).max(new Date().getFullYear()).optional(),
    vin: joi_1.default.string().length(17).optional(), // VIN must be exactly 17 characters
    color: joi_1.default.string().min(3).max(30).optional(),
    minMileage: joi_1.default.number().integer().min(0).optional(),
    maxMileage: joi_1.default.number().integer().min(0).optional(),
    minPrice: joi_1.default.number().min(0).positive().optional(),
    maxPrice: joi_1.default.number().min(0).positive().optional(),
    status: joi_1.default.string().valid('sold', 'available', 'ordered').optional()
});
