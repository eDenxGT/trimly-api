import { statusTypes } from "../../../shared/constants";

export interface IUpdateShopStatusUseCase {
	execute(id: string, status: statusTypes, message?: string): Promise<void>;
}
