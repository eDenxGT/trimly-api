var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { injectable } from "tsyringe";
import { google } from "googleapis";
import { JWT } from "google-auth-library";
import { config } from "../../shared/config.js";
let GoogleCalendarService = class GoogleCalendarService {
    _authClient;
    constructor() {
        this._authClient = new JWT({
            email: config.google.GOOGLE_SERVICE_CLIENT_EMAIL,
            key: config.google.GOOGLE_SERVICE_PRIVATE_KEY,
            scopes: ["https://www.googleapis.com/auth/calendar"],
        });
    }
    async createMeeting(data) {
        const auth = this._authClient;
        const calendar = google.calendar({ version: "v3", auth });
        const startDate = new Date(data.start);
        const endDate = new Date(data.end);
        const res = await calendar.events.insert({
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
        const meetLink = res.data?.conferenceData?.entryPoints?.[0]?.uri;
        return meetLink || "";
    }
};
GoogleCalendarService = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], GoogleCalendarService);
export { GoogleCalendarService };
