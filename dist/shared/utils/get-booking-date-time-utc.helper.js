"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookingDateTimeUTC = getBookingDateTimeUTC;
const date_fns_tz_1 = require("date-fns-tz");
const date_fns_1 = require("date-fns");
function getBookingDateTimeUTC(date, startTime, timeZone = "Asia/Kolkata") {
    const localDateString = (0, date_fns_tz_1.formatInTimeZone)(new Date(date), timeZone, "yyyy-MM-dd");
    const fullDateTimeString = `${localDateString} ${startTime}`;
    const parsedLocal = (0, date_fns_1.parse)(fullDateTimeString, "yyyy-MM-dd hh:mm a", new Date());
    const bookingDateTimeUTC = (0, date_fns_tz_1.fromZonedTime)(parsedLocal, timeZone);
    //   console.log("Input Date:", date, "Start Time:", startTime);
    //   console.log("Final UTC booking datetime:", bookingDateTimeUTC);
    //   console.log("Formatted:", format(bookingDateTimeUTC, "yyyy-MM-dd hh:mm a"));
    return bookingDateTimeUTC;
}
