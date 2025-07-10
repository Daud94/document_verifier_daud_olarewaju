"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const orders_schema_1 = require("./orders.schema");
const app_error_1 = require("../utils/app-error");
const cars_service_1 = require("../cars/cars.service");
const carsService = new cars_service_1.CarsService();
class OrdersService {
    async createOrder(orderData, userId) {
        // Check for duplicate within last 5 minutes
        const recentDuplicate = await orders_schema_1.OrderModel.findOne({
            user: userId,
            car: orderData.carId,
            createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) },
            status: { $nin: ['cancelled'] }
        });
        if (recentDuplicate) {
            throw app_error_1.AppError.conflict('Duplicate order detected');
        }
        // Check if the car exists
        const car = await carsService.getCarById(orderData.carId);
        if (!car) {
            throw app_error_1.AppError.notFound('Car not found');
        }
        if (car.status !== 'available') {
            throw app_error_1.AppError.badRequest('Car is not available for order');
        }
        await orders_schema_1.OrderModel.create({
            ...orderData,
            car: orderData.carId,
            dealer: orderData.dealerId,
            price: car.price,
            user: userId
        });
        car.status = 'ordered';
        await car.save();
    }
    async getOrder(orderId) {
        return await orders_schema_1.OrderModel.findOne({ _id: orderId }).populate('car').populate('dealer').exec();
    }
    async getAllOrders(filterQuery, userId) {
        const where = {};
        if (filterQuery.dealer) {
            where.dealer = filterQuery.dealer;
        }
        if (filterQuery.carId) {
            where.car = filterQuery.carId;
        }
        if (filterQuery.status) {
            where.status = { $regex: filterQuery.status, $options: 'i' };
        }
        if (filterQuery.user) {
            where.user = filterQuery.user;
        }
        if (filterQuery.fromDate && filterQuery.toDate) {
            where.orderDate = {
                $gte: new Date(filterQuery.fromDate),
                $lte: new Date(filterQuery.toDate)
            };
        }
        if (where.dealer == userId) {
            return await orders_schema_1.OrderModel.find(where)
                .populate('car')
                .populate('user')
                .sort({ createdAt: -1 })
                .exec();
        }
        return await orders_schema_1.OrderModel.find(where)
            .populate('car')
            .populate('dealer')
            .sort({ createdAt: -1 })
            .exec();
    }
}
exports.OrdersService = OrdersService;
