export interface IDateManager {
  addDays(days: number): Date;

  addHours(hours: number): Date;

  getDate(): Date;

  isBefore(start: Date, end: Date): boolean;
}
