import { container } from "tsyringe";
import * as uuid from "uuid";

import { IUuiDManager } from "@src/services/protocols/cryptography/uuid";

export class UuidFacade implements IUuiDManager {
  gen(): string {
    return uuid.v4();
  }
}

container.registerSingleton<IUuiDManager>("UuidFacade", UuidFacade);
