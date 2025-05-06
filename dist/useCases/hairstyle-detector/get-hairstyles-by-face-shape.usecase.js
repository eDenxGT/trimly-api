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
import { injectable, inject } from "tsyringe";
import { CustomError } from "../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";
let GetHairstylesByFaceShapeUseCase = class GetHairstylesByFaceShapeUseCase {
    _hairstyleRepository;
    constructor(_hairstyleRepository) {
        this._hairstyleRepository = _hairstyleRepository;
    }
    async execute({ faceShape, gender, }) {
        const normalizedFaceShape = faceShape.toLowerCase();
        const hairstyles = await this._hairstyleRepository.find({
            faceShapes: { $in: [normalizedFaceShape] },
            gender,
        });
        if (!hairstyles.length) {
            throw new CustomError(ERROR_MESSAGES.HAIRSTYLE_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }
        return hairstyles;
    }
};
GetHairstylesByFaceShapeUseCase = __decorate([
    injectable(),
    __param(0, inject("IHairstyleRepository")),
    __metadata("design:paramtypes", [Object])
], GetHairstylesByFaceShapeUseCase);
export { GetHairstylesByFaceShapeUseCase };
