import { IDateManager } from "@src/services/protocols/date";

export class DateMangerSpy implements IDateManager {
  addDaysParams: number;
  addHoursParams: number;
  isBeforeParams: {
    start: Date;
    end: Date;
  };

  addDaysReturn: Date = new Date();
  addHoursReturn: Date = new Date();
  getDateReturn: Date = new Date();
  isBeforeReturn = false;

  addDays(days: number): Date {
    this.addDaysParams = days;

    return this.addDaysReturn;
  }

  addHours(hours: number): Date {
    this.addHoursParams = hours;

    return this.addHoursReturn;
  }

  getDate(): Date {
    return this.getDateReturn;
  }

  isBefore(start: Date, end: Date): boolean {
    this.isBeforeParams = {
      end,
      start,
    };
    return this.isBeforeReturn;
  }
}
