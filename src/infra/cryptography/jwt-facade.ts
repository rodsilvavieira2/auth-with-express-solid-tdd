import jwt from "jsonwebtoken";
import { injectable, inject, container } from "tsyringe";

import { UserDTO } from "@src/domain/dtos";
import {
  IJwtManager,
  JwtPayloadReturn,
} from "@src/services/protocols/cryptography/jwt";

type Payload = Omit<UserDTO, "password">;

@injectable()
export class JwtFacade implements IJwtManager {
  constructor(
    @inject("accessTokenKey")
    private readonly accessTokenKey: string,
    @inject("accessTokenExpiresIn")
    private readonly accessTokenExpiresIn: string | number
  ) {}

  decode<T = unknown>(token: string): JwtPayloadReturn<T> {
    return jwt.decode(token) as JwtPayloadReturn<T>;
  }

  create(sub: string, payload: Payload): string {
    return jwt.sign(payload, this.accessTokenKey, {
      subject: sub,
      expiresIn: this.accessTokenExpiresIn,
    });
  }

  verify(token: string): boolean {
    try {
      jwt.verify(token, this.accessTokenKey);
      return true;
    } catch {
      return false;
    }
  }
}

container.registerSingleton<IJwtManager>("JwtFacade", JwtFacade);
