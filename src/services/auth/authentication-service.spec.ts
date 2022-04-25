import faker from "@faker-js/faker";
import { AuthenticationUseCaseParams } from "@src/domain/use-cases";
import { JWT_CONFIG } from "@src/main/config/env";
import {
  HasherMangerSpy,
  JwtManagerSpy,
  UuidManagerSpy,
} from "@src/mocks/data/cryptography";
import { DateMangerSpy } from "@src/mocks/data/date";
import { TokensRepositorySpy, UsersRepositorySpy } from "@src/mocks/data/db";
import { InvalidCredentialsError } from "@src/validation/errors";

import { removePasswordFiled } from "../util";
import { AuthenticationService } from "./authentication-service";

function makeSut() {
  const usersRepositorySpy = new UsersRepositorySpy();
  const tokensRepositorySpy = new TokensRepositorySpy();
  const dateManagerSpy = new DateMangerSpy();
  const jwtMangerSpy = new JwtManagerSpy();
  const hasherMangerSpy = new HasherMangerSpy();
  const uuidManagerSpy = new UuidManagerSpy();

  const sut = new AuthenticationService(
    usersRepositorySpy,
    tokensRepositorySpy,
    uuidManagerSpy,
    jwtMangerSpy,
    dateManagerSpy,
    hasherMangerSpy
  );

  return {
    sut,
    usersRepositorySpy,
    tokensRepositorySpy,
    dateManagerSpy,
    jwtMangerSpy,
    hasherMangerSpy,
    uuidManagerSpy,
  };
}

describe("AuthenticationService", () => {
  let params: AuthenticationUseCaseParams["auth"];

  beforeEach(() => {
    params = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
  });

  it("should authenticate a user", async () => {
    const {
      sut,
      usersRepositorySpy,
      hasherMangerSpy,
      dateManagerSpy,
      tokensRepositorySpy,
      jwtMangerSpy,
      uuidManagerSpy,
    } = makeSut();

    const ACCESS_TOKEN = "accessToken";
    const REFRESH_TOKEN = "refreshToken";

    jest.spyOn(jwtMangerSpy, "create").mockReturnValueOnce(ACCESS_TOKEN);

    jest.spyOn(uuidManagerSpy, "gen").mockReturnValueOnce(REFRESH_TOKEN);

    const result = await sut.auth(params);

    expect(usersRepositorySpy.findByEmailParams).toEqual({
      email: params.email,
    });

    expect(hasherMangerSpy.compareParams).toEqual({
      plaintext: params.password,
      digest: usersRepositorySpy.findByEmailReturn.password,
    });

    expect(jwtMangerSpy.create).toBeCalledWith(
      usersRepositorySpy.findByEmailReturn.id,
      {
        name: usersRepositorySpy.findByEmailReturn.name,
        email: params.email,
      }
    );

    expect(uuidManagerSpy.gen).toBeCalled();

    expect(dateManagerSpy.addDaysParams).toBe(
      JWT_CONFIG.REFRESH_TOKEN_EXPIRES_IN_DAYS
    );

    expect(tokensRepositorySpy.createParams).toEqual({
      expiresIn: dateManagerSpy.addDaysReturn,
      token: REFRESH_TOKEN,
      userId: usersRepositorySpy.findByEmailReturn.id,
    });

    expect(result).toEqual({
      user: removePasswordFiled(usersRepositorySpy.findByEmailReturn),
      tokens: {
        accessToken: ACCESS_TOKEN,
        refreshToken: REFRESH_TOKEN,
      },
    });
  });

  it("should return an appError if not found an user with the email sent", async () => {
    const { sut, usersRepositorySpy } = makeSut();

    jest.spyOn(usersRepositorySpy, "findByEmail").mockReturnValueOnce(null);

    const result = await sut.auth(params);

    expect(result).toEqual(new InvalidCredentialsError());
  });

  it("should return an appError if the passwords not match", async () => {
    const { sut, hasherMangerSpy } = makeSut();

    jest.spyOn(hasherMangerSpy, "compare").mockResolvedValue(false);

    const result = await sut.auth(params);

    expect(result).toEqual(new InvalidCredentialsError());
  });
});
