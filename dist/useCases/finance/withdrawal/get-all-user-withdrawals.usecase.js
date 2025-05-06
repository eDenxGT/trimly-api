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
let GetAllUserWithdrawalsUseCase = class GetAllUserWithdrawalsUseCase {
    _withdrawalRepository;
    constructor(_withdrawalRepository) {
        this._withdrawalRepository = _withdrawalRepository;
    }
    async execute({ page, limit, status, method, search, sortField, sortDirection, }) {
        const filters = {
            status,
            method,
            search,
        };
        const sorting = {
            field: sortField || "createdAt",
            direction: sortDirection || "desc",
        };
        const offset = (page - 1) * limit;
        const { withdrawals, total } = await this._withdrawalRepository.findUserWithdrawals(filters, { offset, limit }, sorting);
        return {
            withdrawals,
            total,
            page,
            limit,
        };
    }
};
GetAllUserWithdrawalsUseCase = __decorate([
    injectable(),
    __param(0, inject("IWithdrawalRepository")),
    __metadata("design:paramtypes", [Object])
], GetAllUserWithdrawalsUseCase);
export { GetAllUserWithdrawalsUseCase };
