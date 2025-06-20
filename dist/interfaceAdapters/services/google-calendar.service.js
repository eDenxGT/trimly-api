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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleCalendarService = void 0;
const tsyringe_1 = require("tsyringe");
const googleapis_1 = require("googleapis");
const google_auth_library_1 = require("google-auth-library");
const config_1 = require("../../shared/config");
let GoogleCalendarService = class GoogleCalendarService {
    constructor() {
        this._authClient = new google_auth_library_1.JWT({
            email: config_1.config.google.GOOGLE_SERVICE_CLIENT_EMAIL,
            key: config_1.config.google.GOOGLE_SERVICE_PRIVATE_KEY,
            scopes: ["https://www.googleapis.com/auth/calendar"],
        });
    }
    createMeeting(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const auth = this._authClient;
            const calendar = googleapis_1.google.calendar({ version: "v3", auth });
            const startDate = new Date(data.start);
            const endDate = new Date(data.end);
            const res = yield calendar.events.insert({
                calendarId: "primary",
                requestBody: {
                    summary: data.summary,
                    description: data.description,
                    start: { dateTime: startDate.toISOString() },
                    end: { dateTime: endDate.toISOString() },
                    conferenceData: {
                        createRequest: {
                            requestId: `${Date.now()}-${Math.random()}`,
                            conferenceSolutionKey: { type: "hangoutsMeet" },
                        },
                    },
                },
                conferenceDataVersion: 1,
            });
            const meetLink = (_d = (_c = (_b = (_a = res.data) === null || _a === void 0 ? void 0 : _a.conferenceData) === null || _b === void 0 ? void 0 : _b.entryPoints) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.uri;
            return meetLink || "";
        });
    }
};
exports.GoogleCalendarService = GoogleCalendarService;
exports.GoogleCalendarService = GoogleCalendarService = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], GoogleCalendarService);
