//* ====== Module Imports ====== *//
import { Router } from "express";
export class BaseRoute {
    router;
    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }
}
