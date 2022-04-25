import * as uuid from "uuid";

import faker from "@faker-js/faker";
import { mockError } from "@src/mocks/util";

import { UuidFacade } from "./uuid-facade";

jest.mock("uuid", () => ({ v4: jest.fn() }));

function makeSut() {
  const sut = new UuidFacade();

  return {
    sut,
  };
}

describe("UuidFacade", () => {
  it("should  generate a uuid v4", () => {
    const { sut } = makeSut();

    const uuidMock = faker.datatype.uuid();

    jest.spyOn(uuid, "v4").mockReturnValue(uuidMock);

    const result = sut.gen();

    expect(uuid.v4).toBeCalled();

    expect(result).toBe(uuidMock);
  });

  it("should throw if the v4 method fail", async () => {
    const { sut } = makeSut();

    jest.spyOn(uuid, "v4").mockImplementation(mockError);

    expect(() => sut.gen()).toThrow();
  });
});
