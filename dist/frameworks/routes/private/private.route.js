"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateRoutes = void 0;
//* ====== BaseRoute Import ====== *//
const base_route_1 = require("../base.route");
//* ====== PrivateRoute Imports ====== *//
const barber_route_1 = require("../barber.route");
const client_route_1 = require("../client.route");
const admin_route_1 = require("../admin.route");
class PrivateRoutes extends base_route_1.BaseRoute {
    constructor() {
        super();
    }
    initializeRoutes() {
        this.router.use("/_cl", new client_route_1.ClientRoutes().router);
        this.router.use("/_ba", new barber_route_1.BarberRoutes().router);
        this.router.use("/_ad", new admin_route_1.AdminRoutes().router);
    }
}
exports.PrivateRoutes = PrivateRoutes;
