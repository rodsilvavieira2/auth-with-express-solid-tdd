import bcrypt from "bcrypt";
import { container, inject, injectable } from "tsyringe";

import { IHasherManager } from "@src/services/protocols/cryptography/hash";

@injectable()
export class BcryptFacade implements IHasherManager {
  constructor(@inject("bcryptRoundsOuSalts") private readonly rounds: number) {}

  async hash(plaintext: string): Promise<string> {
    const hashed = await bcrypt.hash(plaintext, this.rounds);

    return hashed;
  }

  async compare(plaintext: string, digest: string): Promise<boolean> {
    const isValid = await bcrypt.compare(plaintext, digest);

    return isValid;
  }
}

container.registerSingleton<IHasherManager>("BcryptFacade", BcryptFacade);
