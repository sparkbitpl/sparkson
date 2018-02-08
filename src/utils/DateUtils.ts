const isoRegexp =
  /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/;
const regExp = /(\d{4})-(\d{2})(?:-(\d{2}))/;

export function isDateString(value: string): boolean {
    return isoRegexp.test(value) || regExp.test(value);
}

export function parseDate(value: string): Date {
    if (!isDateString(value)) {
        return null;
    }
    if (isoRegexp.test(value)) {
        return new Date(Date.parse(value));
    }
    const [ , year, month, day] = regExp.exec(value);
    if (day !== undefined) {
        return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
    } else {
        return new Date(parseInt(year, 10), parseInt(month, 10) - 1);
    }
}