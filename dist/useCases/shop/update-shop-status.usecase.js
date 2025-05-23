var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { inject, injectable } from "tsyringe";
import { SHOP_APPROVED_MAIL_CONTENT, SHOP_REJECTION_WITH_MESSAGE_MAIL, } from "../../shared/constants.js";
let UpdateShopStatusUseCase = class UpdateShopStatusUseCase {
    _barberRepository;
    _sendEmailUseCase;
    constructor(_barberRepository, _sendEmailUseCase) {
        this._barberRepository = _barberRepository;
        this._sendEmailUseCase = _sendEmailUseCase;
    }
    async execute(id, status, message) {
        const barberShop = await this._barberRepository.findOne({ userId: id });
        if (status === "blocked") {
            await this._barberRepository.update({ userId: id }, { rejectionReason: message });
            this._sendEmailUseCase.execute(barberShop?.email, "Trimly - Application rejected", SHOP_REJECTION_WITH_MESSAGE_MAIL(barberShop?.shopName, message));
        }
        else {
            await this._barberRepository.update({ userId: id }, { status, rejectionReason: "" });
            this._sendEmailUseCase.execute(barberShop?.email, "Trimly - Application approved", SHOP_APPROVED_MAIL_CONTENT(barberShop?.shopName));
        }
    }
};
UpdateShopStatusUseCase = __decorate([
    injectable(),
    __param(0, inject("IBarberRepository")),
    __param(1, inject("ISendEmailUseCase")),
    __metadata("design:paramtypes", [Object, Object])
], UpdateShopStatusUseCase);
export { UpdateShopStatusUseCase };
