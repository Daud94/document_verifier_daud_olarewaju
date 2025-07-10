"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const express_1 = __importDefault(require("express"));
const create_order_dto_1 = require("./dtos/create-order.dto");
const auth_middleware_1 = require("../middleware/auth.middleware");
const body_validator_1 = require("../validators/body.validator");
const orders_service_1 = require("./orders.service");
const router = express_1.default.Router();
const ordersService = new orders_service_1.OrdersService();
router.post('/create', auth_middleware_1.AuthMiddleware, (0, body_validator_1.Body)(create_order_dto_1.CreateOrderDto), async (req, res, next) => {
    await ordersService.createOrder(req.body, req.user.userId);
    res.status(201).json({
        success: true,
        message: "Order created successfully",
    });
});
router.get('/all', auth_middleware_1.AuthMiddleware, async (req, res, next) => {
    try {
        const options = req.user && req.user.role === 'dealer' ? {
            dealer: req.user.userId,
            user: req.query.userId
        } : { user: req.user.userId, dealer: req.query.userId };
        Object.assign(options, req.query);
        const orders = await ordersService.getAllOrders(options, req.user.userId);
        res.status(200).json({
            success: true,
            message: "Orders retrieved successfully",
            data: orders
        });
    }
    catch (error) {
        next(error);
    }
});
exports.OrdersController = router;
