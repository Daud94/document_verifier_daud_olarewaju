"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarsController = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const body_validator_1 = require("../validators/body.validator");
const add_car_dto_1 = require("./dtos/add-car.dto");
const cars_service_1 = require("./cars.service");
const app_error_1 = require("../utils/app-error");
const update_car_dto_1 = require("./dtos/update-car.dto");
const car_query_dto_1 = require("./dtos/car.query.dto");
const query_validator_1 = require("../validators/query.validator");
const carsService = new cars_service_1.CarsService();
const router = express_1.default.Router();
router.post('/add', auth_middleware_1.AuthMiddleware, (0, body_validator_1.Body)(add_car_dto_1.AddCarDto), async (req, res, next) => {
    try {
        console.log(req.body);
        // Check if the user is an admin
        if (!req.user || req.user.role !== 'dealer') {
            throw app_error_1.AppError.forbidden('Only dealers can add cars');
        }
        const car = await carsService.addCar(req.body, req.user.userId);
        res.status(201).json({
            success: true,
            message: 'Car added successfully',
            data: car
        });
    }
    catch (error) {
        next(error);
    }
});
router.get('/all', auth_middleware_1.AuthMiddleware, (0, query_validator_1.Query)(car_query_dto_1.CarQueryDto), async (req, res, next) => {
    try {
        // Check if the user is an admin
        const options = req.user && req.user.role === 'dealer' ? { user: req.user.userId } : {};
        Object.assign(options, req.query);
        const cars = await carsService.getAllCars(options);
        res.status(200).json({
            success: true,
            message: 'Cars retrieved successfully',
            data: cars
        });
    }
    catch (error) {
        next(error);
    }
});
router.get('/:id/get', auth_middleware_1.AuthMiddleware, async (req, res, next) => {
    try {
        const carId = req.params.id;
        const car = await carsService.getCarById(carId);
        if (!car) {
            throw app_error_1.AppError.notFound('Car not found');
        }
        res.status(200).json({
            success: true,
            message: 'Car retrieved successfully',
            data: car
        });
    }
    catch (error) {
        next(error);
    }
});
router.patch('/:id/update', auth_middleware_1.AuthMiddleware, (0, body_validator_1.Body)(update_car_dto_1.UpdateCarDto), async (req, res, next) => {
    try {
        // Check if the user is an admin
        if (!req.user || req.user.role !== 'dealer') {
            throw app_error_1.AppError.forbidden('Only dealers can update cars');
        }
        const carId = req.params.id;
        await carsService.updateCar(carId, req.body, req.user.userId);
        res.status(200).json({
            success: true,
            message: 'Car details updated successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
router.delete('/:id/delete', auth_middleware_1.AuthMiddleware, async (req, res, next) => {
    try {
        // Check if the user is an admin
        if (!req.user || req.user.role !== 'dealer') {
            throw app_error_1.AppError.forbidden('Only dealers can update cars');
        }
        const carId = req.params.id;
        await carsService.deleteCar(carId, req.user.userId);
        res.status(200).json({
            success: true,
            message: 'Car deleted successfully'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.CarsController = router;
