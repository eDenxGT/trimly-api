import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { format, parse } from "date-fns";

export function getBookingDateTimeUTC(
  date: Date | string,
  startTime: string,
  timeZone = "Asia/Kolkata"
): Date {
  const localDateString = formatInTimeZone(
    new Date(date),
    timeZone,
    "yyyy-MM-dd"
  );
  const fullDateTimeString = `${localDateString} ${startTime}`;

  const parsedLocal = parse(
    fullDateTimeString,
    "yyyy-MM-dd hh:mm a",
    new Date()
  );
  const bookingDateTimeUTC = fromZonedTime(parsedLocal, timeZone);

  //   console.log("Input Date:", date, "Start Time:", startTime);
  //   console.log("Final UTC booking datetime:", bookingDateTimeUTC);
  //   console.log("Formatted:", format(bookingDateTimeUTC, "yyyy-MM-dd hh:mm a"));

  return bookingDateTimeUTC;
}

export function getExactUTC(dateStr: string, timeStr: string): Date {
  const localDateObj = new Date(dateStr);
  const year = localDateObj.getFullYear();
  const month = String(localDateObj.getMonth() + 1).padStart(2, "0");
  const day = String(localDateObj.getDate()).padStart(2, "0");

  // console.log("Date Str:", dateStr);
  // console.log("Time Str:", timeStr);

  const localDateStr = `${year}-${month}-${day}`;
  // console.log("Local Date Str:", localDateStr);
  const combined = `${localDateStr} ${timeStr}`;
  const localDate = parse(combined, "yyyy-MM-dd hh:mm a", new Date());
  // console.log("Local Date:", localDate);
  if (isNaN(localDate.getTime())) {
    throw new Error("Invalid combined datetime: " + combined);
  }

  // const utcDate = new Date(localDate.getTime() - 5.5 * 60 * 60 * 1000);
// console.log("UTC Date:", utcDate);
  return localDate;
}
