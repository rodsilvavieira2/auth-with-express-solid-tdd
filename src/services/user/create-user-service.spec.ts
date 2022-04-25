import faker from "@faker-js/faker";
import { UserUseCasePrams } from "@src/domain/use-cases";
import { JWT_CONFIG } from "@src/main/config/env";
import {
  JwtManagerSpy,
  HasherMangerSpy,
  UuidManagerSpy,
} from "@src/mocks/data/cryptography";
import { DateMangerSpy } from "@src/mocks/data/date";
import { UsersRepositorySpy, TokensRepositorySpy } from "@src/mocks/data/db";
import { EmailAlreadyExistsError } from "@src/validation/errors";

import { removePasswordFiled } from "../util";
import { CreateUserService } from "./create-user-service";

function makeSut() {
  const usersRepositorySpy = new UsersRepositorySpy();
  const tokensRepositorySpy = new TokensRepositorySpy();
  const dateManagerSpy = new DateMangerSpy();
  const jwtMangerSpy = new JwtManagerSpy();
  const hasherMangerSpy = new HasherMangerSpy();
  const uuidManagerSpy = new UuidManagerSpy();

  const sut = new CreateUserService(
    usersRepositorySpy,
    tokensRepositorySpy,
    jwtMangerSpy,
    uuidManagerSpy,
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

describe("CreateUserService", () => {
  let params: UserUseCasePrams["create"];

  beforeEach(() => {
    params = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      avatarUrl: faker.internet.avatar(),
    };
  });

  it("should create a new user", async () => {
    const {
      dateManagerSpy,
      hasherMangerSpy,
      jwtMangerSpy,
      sut,
      tokensRepositorySpy,
      usersRepositorySpy,
      uuidManagerSpy,
    } = makeSut();

    const ACCESS_TOKEN = "accessToken";
    const REFRESH_TOKEN = "refreshToken";

    jest.spyOn(jwtMangerSpy, "create").mockReturnValueOnce(ACCESS_TOKEN);

    jest.spyOn(uuidManagerSpy, "gen").mockReturnValueOnce(REFRESH_TOKEN);

    usersRepositorySpy.findByEmailReturn = null;

    const result = await sut.create(params);

    expect(usersRepositorySpy.findByEmailParams).toEqual({
      email: params.email,
    });

    expect(hasherMangerSpy.hashParams).toBe(params.password);

    expect(usersRepositorySpy.createParams).toEqual({
      ...params,
      password: hasherMangerSpy.hashReturn,
    });

    expect(jwtMangerSpy.create).toBeCalledWith(
      usersRepositorySpy.createReturn.id,
      {
        name: params.name,
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
      userId: usersRepositorySpy.createReturn.id,
    });

    expect(result).toEqual({
      user: removePasswordFiled({
        ...usersRepositorySpy.createReturn,
        ...params,
      }),
      tokens: {
        accessToken: ACCESS_TOKEN,
        refreshToken: REFRESH_TOKEN,
      },
    });
  });

  it("should return an AppError if already have a user with the same email", async () => {
    const { sut } = makeSut();

    const result = await sut.create(params);

    expect(result).toEqual(new EmailAlreadyExistsError());
  });
});
