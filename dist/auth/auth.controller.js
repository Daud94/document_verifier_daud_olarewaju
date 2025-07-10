"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_service_1 = require("./auth.service");
const body_validator_1 = require("../validators/body.validator");
const registerDto_1 = require("./dtos/registerDto");
const loginDto_1 = require("./dtos/loginDto");
const authService = new auth_service_1.AuthService();
router.post('/register', (0, body_validator_1.Body)(registerDto_1.RegisterDto), async (req, res, next) => {
    try {
        await authService.register(req.body);
        res.status(201).json({
            success: true,
            message: 'Registration successful',
        });
    }
    catch (error) {
        next(error);
    }
});
router.post('/login', (0, body_validator_1.Body)(loginDto_1.LoginDto), async (req, res, next) => {
    try {
        const result = await authService.login(req.body);
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result.user,
            authToken: result.token
        });
    }
    catch (error) {
        next(error);
    }
});
exports.AuthController = router;
