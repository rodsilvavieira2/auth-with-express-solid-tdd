import { IHasherManager } from "@src/services/protocols/cryptography/hash";

export class HasherMangerSpy implements IHasherManager {
  hashParams: string;
  compareParams: {
    plaintext: string;
    digest: string;
  };

  hashReturn = "hash";
  compareReturn = true;

  async hash(plaintext: string): Promise<string> {
    this.hashParams = plaintext;

    return this.hashReturn;
  }

  async compare(plaintext: string, digest: string): Promise<boolean> {
    this.compareParams = {
      digest,
      plaintext,
    };

    return this.compareReturn;
  }
}
