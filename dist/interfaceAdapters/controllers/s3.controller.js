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
import { handleErrorResponse } from "../../shared/utils/error.handler.js";
let S3Controller = class S3Controller {
    _generatePresignedUrlUseCase;
    constructor(_generatePresignedUrlUseCase) {
        this._generatePresignedUrlUseCase = _generatePresignedUrlUseCase;
    }
    //* ─────────────────────────────────────────────────────────────
    //*                   🛠️ Generate Presigned URL
    //* ─────────────────────────────────────────────────────────────
    async generatePresignedUrl(req, res) {
        try {
            const { path, operation } = req.query;
            if (typeof path !== "string" ||
                (operation !== "putObject" && operation !== "getObject")) {
                res.status(400).json({ message: "Invalid parameters" });
                return;
            }
            const presignedUrl = await this._generatePresignedUrlUseCase.execute({
                path,
                operation,
            });
            res.status(200).json({ url: presignedUrl });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
};
S3Controller = __decorate([
    injectable(),
    __param(0, inject("IGeneratePresignedUrlUseCase")),
    __metadata("design:paramtypes", [Object])
], S3Controller);
export { S3Controller };
