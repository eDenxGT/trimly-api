"use strict";
//* ====== Node module-alias Imports (to import using @/ ) ====== *//
// import "module-alias/register";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//* ====== DI Imports ====== *//
require("reflect-metadata");
require("./frameworks/di/resolver");
//* ====== Module Imports ====== *//
const chalk_1 = __importDefault(require("chalk"));
//* ====== Other Imports ====== *//
const config_1 = require("./shared/config");
const mongoConnect_1 = require("./frameworks/database/mongoDb/mongoConnect");
const server_1 = require("./frameworks/http/server");
const http_1 = require("http");
const socket_server_1 = require("./frameworks/websockets/socket.server");
const socket_logger_1 = __importDefault(require("./shared/utils/socket.logger"));
const socket_user_store_1 = require("./interfaceAdapters/websockets/socket-user.store");
//* ====== Instance Creation ====== *//
const expressServer = new server_1.ExpressServer();
const mongoConnect = new mongoConnect_1.MongoConnect();
//* ====== Database Connection ====== *//
mongoConnect.connectDB();
//* ====== Create HTTP Server from Express App ====== *//
const httpServer = (0, http_1.createServer)(expressServer.getApp());
//* ====== Setup Socket Server ====== *//
const socketServer = new socket_server_1.SocketServer(httpServer);
//* ====== Socket Events Setup ====== *//
socketServer.onConnection((socket) => {
    // set user id in socket data
    const userStore = socket_user_store_1.SocketUserStore.getInstance();
    socket.on("registerUser", ({ userId }) => {
        socket.data.userId = userId;
        userStore.addUser(userId, socket.id);
    });
    socket_logger_1.default.info("New socket connected", {
        socketId: socket.id,
        event: "connect",
    });
    socket.on("disconnect", () => {
        console.log(chalk_1.default.red.bold("❌ Socket disconnected:", socket.id));
        if (socket.data.userId) {
            userStore.removeUser(socket.data.userId);
        }
        socket_logger_1.default.info("Socket disconnected", {
            socketId: socket.id,
            event: "disconnect",
        });
    });
});
//* ====== Server Startup ====== *//
httpServer.listen(config_1.config.server.PORT, () => {
    console.log(chalk_1.default.yellowBright.bold(`\n\t-------------------------------------------------------`));
    console.log(chalk_1.default.yellowBright.bold(`\t|                                                     |`));
    console.log(chalk_1.default.yellowBright.bold(`\t|        🌐 Server is running on Port =>` +
        chalk_1.default.cyanBright.bold(` ${config_1.config.server.PORT}`) +
        `         |`));
    // console.log(`\n\t-------------------------------------------------------`);
    // console.log(`\t|                                                     |`);
    // console.log(
    // 	`\t|        🌐 Server is running on Port =>` +
    // 		` ${config.server.PORT}` +
    // 		`         |`
    // );
    // console.log(`Server is running on port ${config.server.PORT} ⚡`);
});
