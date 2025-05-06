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
let GetAllShopsUseCase = class GetAllShopsUseCase {
    _barberRepository;
    _getAllServicesUseCase;
    constructor(_barberRepository, _getAllServicesUseCase) {
        this._barberRepository = _barberRepository;
        this._getAllServicesUseCase = _getAllServicesUseCase;
    }
    async execute(forType, pageNumber, pageSize, searchTerm) {
        let filter = {};
        if (searchTerm) {
            filter.$or = [
                { shopName: { $regex: searchTerm, $options: "i" } },
                { email: { $regex: searchTerm, $options: "i" } },
            ];
        }
        const validPageNumber = Math.max(1, pageNumber || 1);
        const validPageSize = Math.max(1, pageSize || 10);
        const skip = (validPageNumber - 1) * validPageSize;
        const limit = validPageSize;
        const { items, total } = await this._barberRepository.findAll({
            ...filter,
            status: forType === "pending"
                ? { $eq: "pending" }
                : forType === "not-active"
                    ? { $eq: "not-active" }
                    : forType === "not-pending"
                        ? { $ne: "pending" }
                        : "active",
        }, skip, limit);
        const shopsWithServices = await Promise.all(items.map(async (shop) => {
            const services = await this._getAllServicesUseCase.execute({
                barberId: shop.userId,
            });
            return {
                ...shop,
                services: services || [],
            };
        }));
        const response = {
            shops: shopsWithServices,
            total: Math.ceil(total / validPageSize),
        };
        return response;
    }
};
GetAllShopsUseCase = __decorate([
    injectable(),
    __param(0, inject("IBarberRepository")),
    __param(1, inject("IGetAllServicesUseCase")),
    __metadata("design:paramtypes", [Object, Object])
], GetAllShopsUseCase);
export { GetAllShopsUseCase };
