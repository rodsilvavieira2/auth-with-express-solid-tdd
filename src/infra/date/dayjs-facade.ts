import dayjs from "dayjs";
import { container, injectable } from "tsyringe";

import { IDateManager } from "@src/services/protocols/date";

@injectable()
export class DayjsFacade implements IDateManager {
  isBefore(start: Date, end: Date): boolean {
    return dayjs(start).isBefore(end);
  }
  addHours(hours: number): Date {
    return dayjs().add(hours, "hour").toDate();
  }
  addDays(days: number): Date {
    return dayjs().add(days, "day").toDate();
  }

  getDate(): Date {
    return dayjs().toDate();
  }
}

container.registerSingleton<IDateManager>("DayjsFacade", DayjsFacade);
