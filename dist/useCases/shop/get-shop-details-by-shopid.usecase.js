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
let GetShopDetailsByShopIdUseCase = class GetShopDetailsByShopIdUseCase {
    _barberRepository;
    constructor(_barberRepository) {
        this._barberRepository = _barberRepository;
    }
    async execute(shopId, forType) {
        const status = forType === "non-active"
            ? "blocked"
            : forType === "pending"
                ? "pending"
                : forType === "all"
                    ? undefined
                    : "active";
        const shop = await this._barberRepository.getBarberShopWithAllDetails({
            userId: shopId,
            ...(status ? { status } : {}),
        });
        if (!shop)
            return null;
        return shop;
    }
};
GetShopDetailsByShopIdUseCase = __decorate([
    injectable(),
    __param(0, inject("IBarberRepository")),
    __metadata("design:paramtypes", [Object])
], GetShopDetailsByShopIdUseCase);
export { GetShopDetailsByShopIdUseCase };
