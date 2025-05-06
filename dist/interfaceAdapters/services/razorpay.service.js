var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import Razorpay from "razorpay";
import { injectable } from "tsyringe";
import { config } from "../../shared/config.js";
import crypto from "crypto";
let RazorpayService = class RazorpayService {
    razorpay;
    constructor() {
        this.razorpay = new Razorpay({
            key_id: config.payment.RAZORPAY_KEY_ID,
            key_secret: config.payment.RAZORPAY_SECRET,
        });
    }
    async createOrder(amount, receipt, notes) {
        return this.razorpay.orders.create({
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${receipt.slice(7, 25)}`,
            notes,
        });
    }
    async verifySignature({ order_id, payment_id, signature, }) {
        const generatedSignature = crypto
            .createHmac("sha256", config.payment.RAZORPAY_SECRET)
            .update(order_id + "|" + payment_id)
            .digest("hex");
        return generatedSignature === signature;
    }
};
RazorpayService = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], RazorpayService);
export { RazorpayService };
