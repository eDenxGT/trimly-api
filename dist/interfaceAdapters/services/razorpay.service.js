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
exports.RazorpayService = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const tsyringe_1 = require("tsyringe");
const config_1 = require("../../shared/config");
const crypto_1 = __importDefault(require("crypto"));
let RazorpayService = class RazorpayService {
    constructor() {
        this.razorpay = new razorpay_1.default({
            key_id: config_1.config.payment.RAZORPAY_KEY_ID,
            key_secret: config_1.config.payment.RAZORPAY_SECRET,
        });
    }
    createOrder(amount, receipt, notes) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.razorpay.orders.create({
                amount: amount * 100,
                currency: "INR",
                receipt: `receipt_${receipt.slice(7, 25)}`,
                notes,
            });
        });
    }
    verifySignature(_a) {
        return __awaiter(this, arguments, void 0, function* ({ order_id, payment_id, signature, }) {
            const generatedSignature = crypto_1.default
                .createHmac("sha256", config_1.config.payment.RAZORPAY_SECRET)
                .update(order_id + "|" + payment_id)
                .digest("hex");
            return generatedSignature === signature;
        });
    }
};
exports.RazorpayService = RazorpayService;
exports.RazorpayService = RazorpayService = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], RazorpayService);
