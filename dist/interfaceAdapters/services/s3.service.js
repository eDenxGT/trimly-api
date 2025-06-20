"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const tsyringe_1 = require("tsyringe");
const config_1 = require("../../shared/config");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
let S3Service = class S3Service {
    generatePresignedUrl(_a) {
        return __awaiter(this, arguments, void 0, function* ({ path, operation, expires, }) {
            const params = {
                Bucket: config_1.config.awsCfg.AWS_BUCKET_NAME,
                Key: path,
                Expires: expires,
            };
            const s3 = new aws_sdk_1.default.S3({
                accessKeyId: config_1.config.awsCfg.AWS_ACCESS_KEY_ID,
                secretAccessKey: config_1.config.awsCfg.AWS_SECRET_ACCESS_KEY,
                region: config_1.config.awsCfg.AWS_REGION,
                signatureVersion: "v4",
            });
            const uploadURL = yield s3.getSignedUrlPromise(operation, params);
            return uploadURL;
        });
    }
};
exports.S3Service = S3Service;
exports.S3Service = S3Service = __decorate([
    (0, tsyringe_1.injectable)()
], S3Service);
