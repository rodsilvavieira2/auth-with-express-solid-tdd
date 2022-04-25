import faker from "@faker-js/faker";
import { AuthenticationUseCaseParams } from "@src/domain/use-cases";
import { AuthenticationSpy } from "@src/mocks/presentation/auth";
import {
  makeHttpRespFromError,
  ok,
  serverError,
} from "@src/presentation/helpers/http";
import { InvalidAccessTokenError } from "@src/validation/errors";

import { AuthenticateController } from "./authenticate-controller";

function makeSut() {
  const authenticationSpy = new AuthenticationSpy();

  const sut = new AuthenticateController(authenticationSpy);

  return {
    sut,
    authenticationSpy,
  };
}

describe("AuthenticateController", () => {
  let params: AuthenticationUseCaseParams["auth"];

  beforeEach(() => {
    params = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
  });

  it("should handle the create user request", async () => {
    const { sut, authenticationSpy } = makeSut();

    const response = await sut.handle(params);

    expect(authenticationSpy.params).toEqual(params);

    expect(response).toEqual(
      ok({
        ...authenticationSpy.result,
      })
    );
  });

  it("should return a http error if no create a user correct", async () => {
    const { authenticationSpy, sut } = makeSut();

    const errorMOCK = new InvalidAccessTokenError();

    authenticationSpy.result = errorMOCK;

    const response = await sut.handle(params);

    expect(response).toEqual(makeHttpRespFromError(errorMOCK));
  });

  it("should return a http server error if the auth method throw", async () => {
    const { sut, authenticationSpy } = makeSut();

    jest.spyOn(authenticationSpy, "auth").mockImplementationOnce(() => {
      throw new Error();
    });

    const response = await sut.handle(params);

    expect(response).toEqual(serverError());
  });
});
