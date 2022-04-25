import e from "express";

import faker from "@faker-js/faker";
import { AuthenticationUseCaseParams } from "@src/domain/use-cases";
import { JWT_CONFIG } from "@src/main/config/env";
import { JwtManagerSpy, UuidManagerSpy } from "@src/mocks/data/cryptography";
import { DateMangerSpy } from "@src/mocks/data/date";
import { UsersRepositorySpy, TokensRepositorySpy } from "@src/mocks/data/db";
import {
  ExpiredRefreshTokenError,
  RefreshTokenNotFoundError,
  UserNotFoundError,
} from "@src/validation/errors";

import { RefreshTokenResetService } from "./refresh-token-reset-service";

function makeSut() {
  const usersRepositorySpy = new UsersRepositorySpy();
  const tokensRepositorySpy = new TokensRepositorySpy();
  const jwtManagerSpy = new JwtManagerSpy();
  const dateManagerSpy = new DateMangerSpy();
  const uuidManagerSpy = new UuidManagerSpy();

  const sut = new RefreshTokenResetService(
    usersRepositorySpy,
    tokensRepositorySpy,
    uuidManagerSpy,
    jwtManagerSpy,
    dateManagerSpy
  );

  return {
    sut,
    usersRepositorySpy,
    tokensRepositorySpy,
    jwtManagerSpy,
    dateManagerSpy,
    uuidManagerSpy,
  };
}

describe("RefreshTokenResetService", () => {
  let params: AuthenticationUseCaseParams["reset"];

  beforeEach(() => {
    params = {
      refreshToken: faker.datatype.uuid(),
    };
  });

  it("should generate new tokens by a valid refresh token", async () => {
    const {
      dateManagerSpy,
      jwtManagerSpy,
      sut,
      tokensRepositorySpy,
      usersRepositorySpy,
      uuidManagerSpy,
    } = makeSut();

    jest.spyOn(dateManagerSpy, "getDate");

    const REFRESH_TOKEN = "refresh token";
    const ACCESS_TOKEN = "access token";

    jest.spyOn(jwtManagerSpy, "create").mockReturnValue(ACCESS_TOKEN);
    jest.spyOn(uuidManagerSpy, "gen").mockReturnValue(REFRESH_TOKEN);

    const result = await sut.reset(params);

    expect(tokensRepositorySpy.findByTokenParams).toEqual({
      token: params.refreshToken,
    });

    expect(dateManagerSpy.getDate).toBeCalled();

    expect(dateManagerSpy.isBeforeParams).toEqual({
      end: dateManagerSpy.getDateReturn,
      start: tokensRepositorySpy.findByTokenReturn.expiresIn,
    });

    expect(usersRepositorySpy.findByIdParams).toEqual({
      userId: tokensRepositorySpy.findByTokenReturn.userId,
    });

    expect(jwtManagerSpy.create).toBeCalledWith(
      usersRepositorySpy.findByIdReturn.id,
      {
        name: usersRepositorySpy.findByIdReturn.name,
        email: usersRepositorySpy.findByIdReturn.email,
      }
    );

    expect(uuidManagerSpy.gen).toBeCalled();

    expect(dateManagerSpy.addDaysParams).toBe(
      JWT_CONFIG.REFRESH_TOKEN_EXPIRES_IN_DAYS
    );

    expect(tokensRepositorySpy.updateByTokenParams).toEqual({
      token: params.refreshToken,
      data: {
        expiresIn: dateManagerSpy.addDaysReturn,
        token: REFRESH_TOKEN,
      },
    });

    expect(result).toEqual({
      accessToken: ACCESS_TOKEN,
      refreshToken: REFRESH_TOKEN,
    });
  });

  it("should return an AppError if the refresh token is not registered", async () => {
    const { sut, tokensRepositorySpy } = makeSut();

    jest.spyOn(tokensRepositorySpy, "findByToken").mockReturnValueOnce(null);

    const result = await sut.reset(params);

    expect(result).toEqual(new RefreshTokenNotFoundError());
  });

  it("should return an AppError if the jwt is expired", async () => {
    const { dateManagerSpy, sut } = makeSut();

    jest.spyOn(dateManagerSpy, "isBefore").mockReturnValueOnce(true);

    const result = await sut.reset(params);

    expect(result).toEqual(new ExpiredRefreshTokenError());
  });

  it("should return an AppError  if the user is not registered", async () => {
    const { usersRepositorySpy, sut } = makeSut();

    jest.spyOn(usersRepositorySpy, "findById").mockReturnValueOnce(null);

    const result = await sut.reset(params);

    expect(result).toEqual(new UserNotFoundError());
  });
});
