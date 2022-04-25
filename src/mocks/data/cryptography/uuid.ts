import faker from "@faker-js/faker";
import { IUuiDManager } from "@src/services/protocols/cryptography/uuid";

export class UuidManagerSpy implements IUuiDManager {
  result: string = faker.datatype.uuid();

  gen(): string {
    return this.result;
  }
}
