import bcrypt from "bcrypt";

import { mockError } from "@src/mocks/util";

import { BcryptFacade } from "./bcrypt-facade";

const BCRYPT_ROUNDS = 10;

function makeSut() {
  const sut = new BcryptFacade(BCRYPT_ROUNDS);

  return {
    sut,
  };
}

jest.mock("bcrypt", () => ({
  hash: () => "hash",
  compare: () => true,
}));

describe("BcryptFacade", () => {
  it("should call bcrypt.hash method", async () => {
    const { sut } = makeSut();

    const hashSpy = jest.spyOn(bcrypt, "hash");

    const plaintext = "any_plaintext";

    await sut.hash(plaintext);

    expect(hashSpy).toBeCalledWith(plaintext, BCRYPT_ROUNDS);
  });

  it("should return the bcrypt.hash return value", async () => {
    const { sut } = makeSut();
    const plaintext = "any_plaintext";

    const response = await sut.hash(plaintext);

    expect(response).toBe("hash");
  });

  it("should call bcrypt.compare method", async () => {
    const { sut } = makeSut();

    const compareSpy = jest.spyOn(bcrypt, "compare");

    const plaintext = "any_plaintext";
    const digest = "any_digest";

    await sut.compare(plaintext, digest);

    expect(compareSpy).toBeCalledWith(plaintext, digest);
  });

  it("should return the bcrypt.compare return value", async () => {
    const { sut } = makeSut();

    const plaintext = "any_plaintext";
    const digest = "any_digest";

    const result = await sut.compare(plaintext, digest);

    expect(result).toBe(true);
  });

  it("should throw if bcrypt.hash throws", () => {
    const { sut } = makeSut();

    jest.spyOn(bcrypt, "hash").mockImplementation(mockError);

    const plaintext = "any_plaintext";

    const promise = sut.hash(plaintext);

    expect(promise).rejects.toThrow();
  });

  it("should throw if bcrypt.compare throws", () => {
    const { sut } = makeSut();

    jest.spyOn(bcrypt, "compare").mockImplementation(mockError);

    const plaintext = "any_plaintext";
    const digest = "any_digest";

    const promise = sut.compare(plaintext, digest);

    expect(promise).rejects.toThrow();
  });
});
