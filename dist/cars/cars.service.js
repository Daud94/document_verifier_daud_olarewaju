"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarsService = void 0;
const cars_shema_1 = require("./cars.shema");
const app_error_1 = require("../utils/app-error");
class CarsService {
    async getCarById(carId) {
        return await cars_shema_1.CarModel.findById(carId).exec();
    }
    async getAllCars(filterQuery) {
        const where = {};
        if (filterQuery.minPrice && filterQuery.maxPrice) {
            where['price'] = {
                $gte: filterQuery.minPrice,
                $lte: filterQuery.maxPrice
            };
        }
        if (filterQuery.minMileage && filterQuery.maxMileage) {
            where['mileage'] = {
                $gte: filterQuery.minMileage,
                $lte: filterQuery.maxMileage
            };
        }
        if (filterQuery.minYear && filterQuery.maxYear) {
            where['year'] = {
                $gte: filterQuery.minYear,
                $lte: filterQuery.maxYear
            };
        }
        where.make = filterQuery.make ? { $regex: filterQuery.make, $options: 'i' } : { $exists: true };
        where.model = filterQuery.model ? { $regex: filterQuery.model, $options: 'i' } : { $exists: true };
        where.color = filterQuery.color ? { $regex: filterQuery.color, $options: 'i' } : { $exists: true };
        where.vin = filterQuery.vin ? { $regex: filterQuery.vin, $options: 'i' } : { $exists: true };
        where.status = filterQuery.status ? { $regex: filterQuery.status, $options: 'i' } : { $exists: true };
        where.user = filterQuery.user ? filterQuery.user : { $exists: true };
        return await cars_shema_1.CarModel.find({
            ...where
        })
            .sort({ make: 1 })
            .exec();
    }
    async addCar(carData, userId) {
        const existingCar = await cars_shema_1.CarModel.findOne({ vin: carData.vin }).exec();
        if (existingCar)
            throw app_error_1.AppError.badRequest('Car with this VIN already exists');
        const newCar = new cars_shema_1.CarModel({ ...carData, user: userId });
        return (await newCar.save()).toJSON();
    }
    async updateCar(carId, carData, userId) {
        const existingCar = await cars_shema_1.CarModel.findOne({ _id: carId, user: userId }).exec();
        if (!existingCar)
            throw app_error_1.AppError.notFound('Car not found');
        Object.assign(existingCar, carData);
        return (await existingCar.save()).toJSON();
    }
    async deleteCar(carId, userId) {
        const existingCar = await cars_shema_1.CarModel.findOne({ _id: carId, user: userId }).exec();
        if (!existingCar)
            throw app_error_1.AppError.notFound('Car not found');
        await cars_shema_1.CarModel.deleteOne({ _id: carId }).exec();
    }
}
exports.CarsService = CarsService;
