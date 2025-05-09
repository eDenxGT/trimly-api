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
let GetAllNearestShopsUseCase = class GetAllNearestShopsUseCase {
    _barberRepository;
    _getAllServicesUseCase;
    constructor(_barberRepository, _getAllServicesUseCase) {
        this._barberRepository = _barberRepository;
        this._getAllServicesUseCase = _getAllServicesUseCase;
    }
    async execute(search, amenities, userLocation, sortBy, sortOrder, page, limit) {
        const amenitiesArray = amenities?.split(",") || [];
        const filters = {
            search,
            amenities: amenitiesArray,
        };
        if (userLocation && userLocation.length === 2) {
            filters.location = {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [userLocation?.[0], userLocation?.[1]],
                    },
                    distanceField: "distance",
                    // maxDistance: 50000, // 50km (in meters)
                    spherical: true,
                },
            };
        }
        const pagination = {
            page: page || 1,
            limit: limit || 9,
        };
        const sort = {
            sortBy: sortBy === "rating" ? "averageRating" : "",
            sortOrder: sortOrder || "asc",
        };
        const shops = await this._barberRepository.findAllNearbyShopsWithFilters(filters, sort, pagination);
        if (!shops)
            return null;
        return shops;
    }
};
GetAllNearestShopsUseCase = __decorate([
    injectable(),
    __param(0, inject("IBarberRepository")),
    __param(1, inject("IGetAllServicesUseCase")),
    __metadata("design:paramtypes", [Object, Object])
], GetAllNearestShopsUseCase);
export { GetAllNearestShopsUseCase };
