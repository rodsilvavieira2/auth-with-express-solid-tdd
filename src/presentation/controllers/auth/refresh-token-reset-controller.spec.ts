import faker from "@faker-js/faker";
import { AuthenticationUseCaseParams } from "@src/domain/use-cases";
import { RefreshTokenResetSpy } from "@src/mocks/presentation/auth";
import {
  makeHttpRespFromError,
  ok,
  serverError,
} from "@src/presentation/helpers/http";
import { InvalidAccessTokenError } from "@src/validation/errors";

import { RefreshTokenResetController } from "./refresh-token-reset-controller";

function makeSut() {
  const refreshTokenResetSpy = new RefreshTokenResetSpy();

  const sut = new RefreshTokenResetController(refreshTokenResetSpy);

  return {
    refreshTokenResetSpy,
    sut,
  };
}

describe("RefreshTokenResetController", () => {
  let params: AuthenticationUseCaseParams["reset"];

  const tokens = faker.datatype.uuid();

  beforeEach(() => {
    params = {
      refreshToken: tokens,
    };
  });

  it("should fulfill the request to create new access tokens ", async () => {
    const { refreshTokenResetSpy, sut } = makeSut();

    const response = await sut.handle(params);

    expect(refreshTokenResetSpy.params).toEqual(params);

    expect(response).toEqual(
      ok({
        ...refreshTokenResetSpy.result,
      })
    );
  });

  it("should return an bad request if the jwt are invalid", async () => {
    const { sut } = makeSut();

    const response = await sut.handle({
      refreshToken: "invalid_jwt",
    });

    expect(response.statusCode).toBe(400);
  });

  it("should return an http error status if not generate news tokens", async () => {
    const { refreshTokenResetSpy, sut } = makeSut();

    const errorMOCK = new InvalidAccessTokenError();

    refreshTokenResetSpy.result = errorMOCK;

    const response = await sut.handle(params);

    expect(response).toEqual(makeHttpRespFromError(errorMOCK));
  });

  it("should return an serve error status if the reset method throws", async () => {
    const { refreshTokenResetSpy, sut } = makeSut();

    jest.spyOn(refreshTokenResetSpy, "reset").mockImplementationOnce(() => {
      throw new Error();
    });

    const response = await sut.handle(params);

    expect(response).toEqual(serverError());
  });
});
