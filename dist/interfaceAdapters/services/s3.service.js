var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from "tsyringe";
import { config } from "../../shared/config.js";
import AWS from "aws-sdk";
let S3Service = class S3Service {
    async generatePresignedUrl({ path, operation, expires, }) {
        const params = {
            Bucket: config.awsCfg.AWS_BUCKET_NAME,
            Key: path,
            Expires: expires,
        };
        const s3 = new AWS.S3({
            accessKeyId: config.awsCfg.AWS_ACCESS_KEY_ID,
            secretAccessKey: config.awsCfg.AWS_SECRET_ACCESS_KEY,
            region: config.awsCfg.AWS_REGION,
            signatureVersion: "v4",
        });
        const uploadURL = await s3.getSignedUrlPromise(operation, params);
        return uploadURL;
    }
};
S3Service = __decorate([
    injectable()
], S3Service);
export { S3Service };
