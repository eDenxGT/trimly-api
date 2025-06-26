"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookingDateTimeUTC = getBookingDateTimeUTC;
exports.getExactUTC = getExactUTC;
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
function getExactUTC(dateStr, timeStr) {
    const localDateObj = new Date(dateStr);
    const year = localDateObj.getFullYear();
    const month = String(localDateObj.getMonth() + 1).padStart(2, "0");
    const day = String(localDateObj.getDate()).padStart(2, "0");
    // console.log("Date Str:", dateStr);
    // console.log("Time Str:", timeStr);
    const localDateStr = `${year}-${month}-${day}`;
    // console.log("Local Date Str:", localDateStr);
    const combined = `${localDateStr} ${timeStr}`;
    const localDate = (0, date_fns_1.parse)(combined, "yyyy-MM-dd hh:mm a", new Date());
    // console.log("Local Date:", localDate);
    if (isNaN(localDate.getTime())) {
        throw new Error("Invalid combined datetime: " + combined);
    }
    // const utcDate = new Date(localDate.getTime() - 5.5 * 60 * 60 * 1000);
    // console.log("UTC Date:", utcDate);
    return localDate;
}
