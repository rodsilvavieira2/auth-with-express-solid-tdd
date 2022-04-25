import faker from "@faker-js/faker";
import { AuthenticateUserByJWTSpy } from "@src/mocks/presentation/auth";
import { mockAppError, mockError } from "@src/mocks/util";
import { MissingAccessToken } from "@src/validation/errors";

import {
  authentication,
  makeHttpRespFromError,
  ok,
  serverError,
} from "../helpers/http";
import { AuthMiddleware } from "./auth-middleware";

function makeSut() {
  const authenticateUserByJWTSpy = new AuthenticateUserByJWTSpy();

  const sut = new AuthMiddleware(authenticateUserByJWTSpy);

  return {
    authenticateUserByJWTSpy,
    sut,
  };
}

type Params = {
  accessToken?: string;
};

describe("AuthMiddleware", () => {
  let params: Params;

  beforeEach(() => {
    params = {
      accessToken: faker.datatype.uuid(),
    };
  });

  it("should call authenticateUserByJWT.authByToken with correctly params", async () => {
    const { sut, authenticateUserByJWTSpy } = makeSut();

    await sut.handle(params);

    expect(authenticateUserByJWTSpy.params).toEqual({
      token: params.accessToken,
    });
  });

  it("should returns a http error if missing the access token ", async () => {
    const { sut } = makeSut();

    const response = await sut.handle({});

    expect(response).toEqual(authentication(new MissingAccessToken()));
  });

  it("should returns a http error if authenticateUserByJWT.authByToken returns a error", async () => {
    const { sut, authenticateUserByJWTSpy } = makeSut();

    const error = mockAppError();

    authenticateUserByJWTSpy.result = error;

    const response = await sut.handle(params);

    expect(response).toEqual(makeHttpRespFromError(error));
  });

  it("should return the user id with http status ok if the user was authenticated correctly", async () => {
    const { sut, authenticateUserByJWTSpy } = makeSut();

    const user = authenticateUserByJWTSpy.result as any;

    const response = await sut.handle(params);

    expect(response).toEqual(ok({ userId: user.id }));
  });

  it("should return a server error if authenticateUserByJWT.authByToken throws", async () => {
    const { authenticateUserByJWTSpy, sut } = makeSut();

    jest
      .spyOn(authenticateUserByJWTSpy, "authByToken")
      .mockImplementation(mockError);

    const response = await sut.handle(params);

    expect(response).toEqual(serverError());
  });
});
