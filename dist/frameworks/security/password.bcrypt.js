var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from "tsyringe";
import bcrypt from "bcryptjs";
import { config } from "../../shared/config.js";
let PasswordBcrypt = class PasswordBcrypt {
    async hash(original) {
        return bcrypt.hash(original, config.bcryptSaltRounds);
    }
    async compare(current, original) {
        return bcrypt.compare(current, original);
    }
};
PasswordBcrypt = __decorate([
    injectable()
], PasswordBcrypt);
export { PasswordBcrypt };
