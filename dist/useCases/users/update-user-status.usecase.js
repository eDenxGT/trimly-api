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
import { CustomError } from "../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";
let UpdateUserStatusUseCase = class UpdateUserStatusUseCase {
    _clientRepository;
    _barberRepository;
    constructor(_clientRepository, _barberRepository) {
        this._clientRepository = _clientRepository;
        this._barberRepository = _barberRepository;
    }
    async execute(userType, userId) {
        let repo;
        if (userType === "client") {
            repo = this._clientRepository;
        }
        else if (userType === "barber") {
            repo = this._barberRepository;
        }
        else {
            throw new CustomError(ERROR_MESSAGES.INVALID_ROLE, HTTP_STATUS.BAD_REQUEST);
        }
        const user = await repo.findOne({ userId });
        if (!user) {
            throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }
        const newStatus = user.status === "active" ? "blocked" : "active";
        await repo.update({ userId }, {
            status: newStatus,
        });
    }
};
UpdateUserStatusUseCase = __decorate([
    injectable(),
    __param(0, inject("IClientRepository")),
    __param(1, inject("IBarberRepository")),
    __metadata("design:paramtypes", [Object, Object])
], UpdateUserStatusUseCase);
export { UpdateUserStatusUseCase };
