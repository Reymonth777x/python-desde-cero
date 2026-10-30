export function localDateTimeToUtcIso(
  value: string,
  timezoneOffsetMinutes: number,
): string | null {
  const match = /^(\\d{4})-(\\d{2})-(\\d{2})T(\\d{2}):(\\d{2})$/.exec(value);
  if (!match || !Number.isInteger(timezoneOffsetMinutes) || Math.abs(timezoneOffsetMinutes) > 840) {
    return null;
  }

  const [, yearText, monthText, dayText, hourText, minuteText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const hour = Number(hourText);
  const minute = Number(minuteText);

  if (year < 1000 || month < 1 || month > 12 || day < 1 || day > 31 || hour > 23 || minute > 59) {
    return null;
  }

  const localClockAsUtc = Date.UTC(year, month - 1, day, hour, minute);
  const calendarCheck = new Date(localClockAsUtc);
  if (
    calendarCheck.getUTCFullYear() !== year ||
    calendarCheck.getUTCMonth() !== month - 1 ||
    calendarCheck.getUTCDate() !== day ||
    calendarCheck.getUTCHours() !== hour ||
    calendarCheck.getUTCMinutes() !== minute
  ) {
    return null;
  }

  // getTimezoneOffset() is UTC minus local time. Add it to the local wall-clock
  // value to obtain the UTC instant selected by the user's device.
  return new Date(localClockAsUtc + timezoneOffsetMinutes * 60_000).toISOString();
}
