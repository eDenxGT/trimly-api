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
exports.AddHairstyleUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const unique_uuid_helper_1 = require("../../shared/utils/unique-uuid.helper");
const custom_error_1 = require("../../entities/utils/custom.error");
const constants_1 = require("../../shared/constants");
let AddHairstyleUseCase = class AddHairstyleUseCase {
    constructor(_hairstyleRepository) {
        this._hairstyleRepository = _hairstyleRepository;
    }
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ faceShapes, gender, name, image, }) {
            const hairstyle = yield this._hairstyleRepository.findOne({
                name,
            });
            if (hairstyle) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.HAIRSTYLE_ALREADY_EXISTS, constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            yield this._hairstyleRepository.save({
                hairstyleId: (0, unique_uuid_helper_1.generateUniqueId)("hairstyle"),
                faceShapes,
                gender: gender,
                name,
                image,
            });
        });
    }
};
exports.AddHairstyleUseCase = AddHairstyleUseCase;
exports.AddHairstyleUseCase = AddHairstyleUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IHairstyleRepository")),
    __metadata("design:paramtypes", [Object])
], AddHairstyleUseCase);
