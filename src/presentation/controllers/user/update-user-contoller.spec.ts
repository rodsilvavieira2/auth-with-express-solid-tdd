import faker from "@faker-js/faker";
import { UpdateUserSpy } from "@src/mocks/presentation/user";
import { makeAppErrorMock } from "@src/mocks/validation";
import {
  ok,
  makeHttpRespFromError,
  serverError,
} from "@src/presentation/helpers/http";

import {
  UpdateUserController,
  UpdateUserRequest,
} from "./update-user-controller";

function makeSut() {
  const updateUserSpy = new UpdateUserSpy();

  const sut = new UpdateUserController(updateUserSpy);

  return {
    updateUserSpy,
    sut,
  };
}

describe("UpdateUserController", () => {
  let params: UpdateUserRequest;

  beforeEach(() => {
    params = {
      userId: faker.datatype.uuid(),
      avatarUrl: faker.internet.avatar(),
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: faker.internet.password(),
    };
  });

  it("should handle the request and update a existing user", async () => {
    const { updateUserSpy, sut } = makeSut();

    const response = await sut.handle(params);

    const { userId, ...rest } = params;

    expect(updateUserSpy.params).toEqual({
      userId,
      data: {
        ...rest,
      },
    });

    expect(response).toEqual(ok({ ...updateUserSpy.result }));
  });

  it("should not accept invalid params", async () => {
    const { sut } = makeSut();

    const tests = [
      {
        label: "email",
        value: "",
      },
      {
        label: "email",
        value: "rod@gmailcom",
      },
      {
        label: "password",
        value: "",
      },
      {
        label: "password",
        value: "123",
      },
      {
        label: "name",
        value: "",
      },
      {
        label: "avatarUrl",
        value: "",
      },
    ];

    tests.forEach(async (test) => {
      const invalidParams = {
        ...params,
        [test.label]: test.value,
      };

      const response = await sut.handle(invalidParams);

      expect(response.statusCode).toBe(400);
    });
  });

  it("should return a http error status if not update the user", async () => {
    const { updateUserSpy, sut } = makeSut();

    const error = makeAppErrorMock();

    updateUserSpy.result = error;

    const response = await sut.handle(params);

    expect(response).toEqual(makeHttpRespFromError(error));
  });

  it("should return a http server error if the update method throws", async () => {
    const { updateUserSpy, sut } = makeSut();

    jest.spyOn(updateUserSpy, "update").mockRejectedValue(new Error());

    const response = await sut.handle(params);

    expect(response).toEqual(serverError());
  });
});
