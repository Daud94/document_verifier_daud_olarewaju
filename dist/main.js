"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_service_1 = require("./config/config.service");
const config_1 = require("./config/config");
const configService = new config_service_1.ConfigService();
const port = configService.get('PORT');
app_1.default.listen(port, async () => {
    await (0, config_1.connectDatabase)();
    console.log(`Server is running on http://localhost:${port}`);
});
