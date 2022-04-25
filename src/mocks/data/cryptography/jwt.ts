import {
  IJwtManager,
  JwtPayloadReturn,
} from "@src/services/protocols/cryptography/jwt";

export class JwtManagerSpy implements IJwtManager {
  createParams: {
    sub: string;
    payload: unknown;
  };
  verifyParams: string;

  decodeParams: string;

  createReturn = "token";
  verifyReturn = true;
  decodeReturn: JwtPayloadReturn = {
    exp: 111,
    iat: 111,
    sub: "sub",
  };

  create(sub: string, payload: unknown): string {
    this.createParams = {
      payload,
      sub,
    };

    return this.createReturn;
  }
  verify(token: string): boolean {
    this.verifyParams = token;

    return this.verifyReturn;
  }

  decode(token: string): JwtPayloadReturn {
    this.decodeParams = token;

    return this.decodeReturn;
  }
}
