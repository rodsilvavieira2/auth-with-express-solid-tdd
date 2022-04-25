import faker from "@faker-js/faker";
import { UserUseCasePrams } from "@src/domain/use-cases";
import { CreateUserSpy } from "@src/mocks/presentation/user";
import { makeAppErrorMock } from "@src/mocks/validation";
import {
  created,
  makeHttpRespFromError,
  serverError,
} from "@src/presentation/helpers/http";

import { CreateUserController } from "./create-user-controller";

function makeSut() {
  const createUserSpy = new CreateUserSpy();

  const sut = new CreateUserController(createUserSpy);

  return {
    createUserSpy,
    sut,
  };
}

describe("CreateUserController", () => {
  let params: UserUseCasePrams["create"];

  beforeEach(() => {
    params = {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: faker.internet.password(),
      avatarUrl: faker.internet.avatar(),
    };
  });

  it("should handle the request and create a new user", async () => {
    const { createUserSpy, sut } = makeSut();

    const response = await sut.handle(params);

    expect(createUserSpy.params).toEqual(params);

    expect(response).toEqual(created(createUserSpy.result));
  });

  it("should return a bad request status if sent invalid params on the body request", async () => {
    const { sut } = makeSut();

    const invalidParams = {
      ...params,
      email: "invalid_email",
    };

    const response = await sut.handle(invalidParams);

    expect(response.statusCode).toBe(400);
  });

  it("should return a http error status if not create the user", async () => {
    const { createUserSpy, sut } = makeSut();

    const error = makeAppErrorMock();

    createUserSpy.result = error;

    const response = await sut.handle(params);

    expect(response).toEqual(makeHttpRespFromError(error));
  });

  it("should return a http server error if the create method throws", async () => {
    const { createUserSpy, sut } = makeSut();

    jest.spyOn(createUserSpy, "create").mockRejectedValue(new Error());

    const response = await sut.handle(params);

    expect(response).toEqual(serverError());
  });
});
