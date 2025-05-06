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
let UserExistenceService = class UserExistenceService {
    _barberRepository;
    _clientRepository;
    _adminRepository;
    constructor(_barberRepository, _clientRepository, _adminRepository) {
        this._barberRepository = _barberRepository;
        this._clientRepository = _clientRepository;
        this._adminRepository = _adminRepository;
    }
    async emailExists(email) {
        const [barber, client, admin] = await Promise.all([
            this._barberRepository.findOne({ email }),
            this._clientRepository.findOne({ email }),
            this._adminRepository.findOne({ email }),
        ]);
        return Boolean(barber || client || admin);
    }
};
UserExistenceService = __decorate([
    injectable(),
    __param(0, inject("IBarberRepository")),
    __param(1, inject("IClientRepository")),
    __param(2, inject("IAdminRepository")),
    __metadata("design:paramtypes", [Object, Object, Object])
], UserExistenceService);
export { UserExistenceService };
