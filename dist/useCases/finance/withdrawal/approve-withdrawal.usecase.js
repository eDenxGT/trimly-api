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
let ApproveWithdrawalUseCase = class ApproveWithdrawalUseCase {
    _withdrawalRepository;
    _transactionRepository;
    constructor(_withdrawalRepository, _transactionRepository) {
        this._withdrawalRepository = _withdrawalRepository;
        this._transactionRepository = _transactionRepository;
    }
    async execute({ withdrawalId }) {
        await this._withdrawalRepository.update({ withdrawalId }, { status: "approved", processedAt: new Date() });
        await this._transactionRepository.update({
            source: "withdrawal",
            referenceId: withdrawalId,
        }, {
            status: "success",
        });
    }
};
ApproveWithdrawalUseCase = __decorate([
    injectable(),
    __param(0, inject("IWithdrawalRepository")),
    __param(1, inject("ITransactionRepository")),
    __metadata("design:paramtypes", [Object, Object])
], ApproveWithdrawalUseCase);
export { ApproveWithdrawalUseCase };
