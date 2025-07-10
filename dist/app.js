"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const error_handler_1 = require("./middleware/error-handler");
const not_found_1 = require("./middleware/not-found");
const morgan_1 = __importDefault(require("morgan"));
const auth_controller_1 = require("./auth/auth.controller");
const cars_controller_1 = require("./cars/cars.controller");
const orders_controller_1 = require("./orders/orders.controller");
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)('dev'));
app.use('/auth', auth_controller_1.AuthController);
app.use('/cars', cars_controller_1.CarsController);
app.use('/orders', orders_controller_1.OrdersController);
// not found handler
app.use(not_found_1.notFound);
// error handler
// @ts-ignore
app.use(error_handler_1.errorHandler);
exports.default = app;
