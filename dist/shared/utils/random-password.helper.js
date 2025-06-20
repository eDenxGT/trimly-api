"use strict";
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
exports.generateRandomPassword = generateRandomPassword;
function generateRandomPassword(fullName, email) {
    return __awaiter(this, void 0, void 0, function* () {
        const namePart = fullName ? fullName.split(" ")[0] : email.split("@")[0];
        const sanitizedPart = namePart.replace(/[^a-zA-Z0-9]/g, "");
        const uppercase = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        const lowercase = String.fromCharCode(97 + Math.floor(Math.random() * 26));
        const number = String.fromCharCode(48 + Math.floor(Math.random() * 10));
        const specialChars = "@$!%*?&";
        const special = specialChars[Math.floor(Math.random() * specialChars.length)];
        const randomNumbers = Math.floor(10000 + Math.random() * 90000);
        const tempPassword = `Trimly${sanitizedPart}${uppercase}${lowercase}${number}${special}${randomNumbers}`;
        return tempPassword;
    });
}
