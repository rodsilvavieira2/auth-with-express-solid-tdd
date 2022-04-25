/* eslint-disable @typescript-eslint/no-explicit-any */
import faker from "@faker-js/faker";
import { AuthenticationUseCaseParams } from "@src/domain/use-cases";
import { JwtManagerSpy } from "@src/mocks/data/cryptography";
import { UsersRepositorySpy } from "@src/mocks/data/db";
import { InvalidAccessTokenError } from "@src/validation/errors";

import { removePasswordFiled } from "../util";
import { AuthenticateUserByJWTService } from "./authenticate-user-by-jwt-service";

function makeSut() {
  const usersRepositorySpy = new UsersRepositorySpy();
  const jwtManagerSpy = new JwtManagerSpy();

  const sut = new AuthenticateUserByJWTService(
    jwtManagerSpy,
    usersRepositorySpy
  );

  return {
    sut,
    jwtManagerSpy,
    usersRepositorySpy,
  };
}

describe("AuthenticateUserByJWTService", () => {
  let params: AuthenticationUseCaseParams["authByToken"];

  beforeEach(() => {
    params = {
      token: faker.datatype.uuid(),
    };
  });

  it("should authenticate a user by jwt", async () => {
    const { sut, usersRepositorySpy, jwtManagerSpy } = makeSut();

    const result = await sut.authByToken(params);

    expect(jwtManagerSpy.verifyParams).toBe(params.token);

    expect(jwtManagerSpy.decodeParams).toEqual(params.token);

    expect(usersRepositorySpy.findByIdParams).toEqual({
      userId: jwtManagerSpy.decodeReturn.sub,
    });

    expect(result).toEqual(
      removePasswordFiled(usersRepositorySpy.findByIdReturn)
    );
  });

  it("should return an AppError if the jwt is invalid", async () => {
    const { sut, jwtManagerSpy } = makeSut();

    jest.spyOn(jwtManagerSpy, "verify").mockReturnValue(false);

    const result = await sut.authByToken(params);

    expect(result).toEqual(new InvalidAccessTokenError());
  });

  it("should return an AppError if not find the user with the sub of the jwt ", async () => {
    const { sut, usersRepositorySpy } = makeSut();

    jest.spyOn(usersRepositorySpy, "findById").mockReturnValue(null);

    const result = await sut.authByToken(params);

    expect(result).toEqual(new InvalidAccessTokenError());
  });
});
