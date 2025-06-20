"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllNearestShopsUseCase = void 0;
const tsyringe_1 = require("tsyringe");
let GetAllNearestShopsUseCase = class GetAllNearestShopsUseCase {
    constructor(_barberRepository, _getAllServicesUseCase) {
        this._barberRepository = _barberRepository;
        this._getAllServicesUseCase = _getAllServicesUseCase;
    }
    execute(search, amenities, userLocation, sortBy, sortOrder, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const amenitiesArray = (amenities === null || amenities === void 0 ? void 0 : amenities.split(",")) || [];
            const filters = {
                search,
                amenities: amenitiesArray,
            };
            if (userLocation && userLocation.length === 2) {
                filters.geoLocation = {
                    $geoNear: {
                        near: {
                            type: "Point",
                            coordinates: [userLocation === null || userLocation === void 0 ? void 0 : userLocation[0], userLocation === null || userLocation === void 0 ? void 0 : userLocation[1]],
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
            const shops = yield this._barberRepository.findAllNearbyShopsWithFilters(filters, sort, pagination);
            if (!shops)
                return null;
            return shops;
        });
    }
};
exports.GetAllNearestShopsUseCase = GetAllNearestShopsUseCase;
exports.GetAllNearestShopsUseCase = GetAllNearestShopsUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IBarberRepository")),
    __param(1, (0, tsyringe_1.inject)("IGetAllServicesUseCase")),
    __metadata("design:paramtypes", [Object, Object])
], GetAllNearestShopsUseCase);
