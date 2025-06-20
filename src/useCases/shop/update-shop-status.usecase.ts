import { inject, injectable } from "tsyringe";
import { IUpdateShopStatusUseCase } from "../../entities/useCaseInterfaces/shop/update-shop-status-usecase.interface";
import { IBarberRepository } from "../../entities/repositoryInterfaces/users/barber-repository.interface";
import { ISendEmailUseCase } from "../../entities/useCaseInterfaces/common/send-email-usecase.interface";
import {
	SHOP_APPROVED_MAIL_CONTENT,
	SHOP_REJECTION_WITH_MESSAGE_MAIL,
	statusTypes,
} from "../../shared/constants";

@injectable()
export class UpdateShopStatusUseCase implements IUpdateShopStatusUseCase {
	constructor(
		@inject("IBarberRepository")
		private _barberRepository: IBarberRepository,
		@inject("ISendEmailUseCase")
		private _sendEmailUseCase: ISendEmailUseCase
	) {}
	async execute(
		id: string,
		status: statusTypes,
		message?: string
	): Promise<void> {
		const barberShop = await this._barberRepository.findOne({ userId: id });
		if (status === "blocked") {
			await this._barberRepository.update(
				{ userId: id },
				{ rejectionReason: message }
			);
			this._sendEmailUseCase.execute(
				barberShop?.email as string,
				"Trimly - Application rejected",
				SHOP_REJECTION_WITH_MESSAGE_MAIL(
					barberShop?.shopName as string,
					message as string
				)
			);
		} else {
			await this._barberRepository.update({ userId: id }, { status, rejectionReason: "" });
			this._sendEmailUseCase.execute(
				barberShop?.email as string,
				"Trimly - Application approved",
				SHOP_APPROVED_MAIL_CONTENT(barberShop?.shopName as string)
			);
		}
	}
}
