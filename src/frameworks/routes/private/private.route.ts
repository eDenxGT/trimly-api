//* ====== BaseRoute Import ====== *//
import { BaseRoute } from "../base.route";

//* ====== PrivateRoute Imports ====== *//
import { BarberRoutes } from "../barber.route";
import { ClientRoutes } from "../client.route";
import { AdminRoutes } from "../admin.route";

export class PrivateRoutes extends BaseRoute {
	constructor() {
		super();
	}
	protected initializeRoutes(): void {
		this.router.use("/_cl", new ClientRoutes().router);
		this.router.use("/_ba", new BarberRoutes().router)
		this.router.use("/_ad", new AdminRoutes().router)
	}
}
