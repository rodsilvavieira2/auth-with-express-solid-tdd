import dayjs from "dayjs";

import { mockError } from "@src/mocks/util";

import { DayjsFacade } from "./dayjs-facade";

function makeSut() {
  const sut = new DayjsFacade();

  return {
    sut,
  };
}

describe("DayjsFacade", () => {
  it("should call dayjs.toDate to get the current date", () => {
    const toDateSpy = jest.fn();

    dayjs.prototype.toDate = toDateSpy;

    const { sut } = makeSut();

    sut.getDate();

    expect(toDateSpy).toBeCalled();
  });

  it("should returns the dayjs.toDate return value on getting the current date", () => {
    const { sut } = makeSut();

    const mockedDate = new Date("2020-01-01");

    const toDateSpy = jest.fn().mockReturnValue(mockedDate);

    dayjs.prototype.toDate = toDateSpy;

    const result = sut.getDate();

    expect(result).toEqual(mockedDate);
  });

  it("should throws if dayjs.toDate throws", () => {
    const { sut } = makeSut();

    const toDateSpy = jest.fn().mockImplementation(mockError);

    dayjs.prototype.toDate = toDateSpy;

    expect(() => sut.getDate()).toThrow();
  });

  it("should call dayjs.add to add days correctly", () => {
    const { sut } = makeSut();

    const toDateSpy = jest.fn();
    const addSpy = jest.fn().mockReturnValue({
      toDate: toDateSpy,
    });

    dayjs.prototype.add = addSpy;

    sut.addDays(10);

    expect(addSpy).toBeCalledWith(10, "day");
    expect(toDateSpy).toBeCalled();
  });

  it("should return the dayjs.add return value on adding days to the current date", () => {
    const { sut } = makeSut();

    const mockedDate = new Date("2020-01-01");

    const toDateSpy = jest.fn().mockReturnValue(mockedDate);
    const addSpy = jest.fn().mockReturnValue({
      toDate: toDateSpy,
    });

    dayjs.prototype.add = addSpy;

    const result = sut.addDays(10);

    expect(result).toEqual(mockedDate);
  });

  it("should throws if dayjs.add(days,'day') throws", () => {
    const { sut } = makeSut();

    const addSpy = jest.fn().mockImplementation(mockError);

    dayjs.prototype.add = addSpy;

    expect(() => sut.addDays(10)).toThrow();
  });

  it("should call dayjs.add to add hours correctly", () => {
    const { sut } = makeSut();

    const toDateSpy = jest.fn();
    const addSpy = jest.fn().mockReturnValue({
      toDate: toDateSpy,
    });

    dayjs.prototype.add = addSpy;

    sut.addHours(10);

    expect(addSpy).toBeCalledWith(10, "hour");
    expect(toDateSpy).toBeCalled();
  });

  it("should return the dayjs.add return value on adding hours to the current date", () => {
    const { sut } = makeSut();

    const mockedDate = new Date("2020-01-01");

    const toDateSpy = jest.fn().mockReturnValue(mockedDate);
    const addSpy = jest.fn().mockReturnValue({
      toDate: toDateSpy,
    });

    dayjs.prototype.add = addSpy;

    const result = sut.addHours(10);

    expect(result).toEqual(mockedDate);
  });

  it("should throws if dayjs.add(days,'hours') throws", () => {
    const { sut } = makeSut();

    const addSpy = jest.fn().mockImplementation(mockError);

    dayjs.prototype.add = addSpy;

    expect(() => sut.addHours(10)).toThrow();
  });

  it("should call dayjs(start).isBefore(end) correctly", () => {
    const { sut } = makeSut();

    const isBeforeMock = jest.fn();

    dayjs.prototype.isBefore = isBeforeMock;

    const startDate = new Date("2020-01-01");
    const endDate = new Date("2020-01-02");

    sut.isBefore(startDate, endDate);

    expect(isBeforeMock).toBeCalledWith(endDate);
  });

  it("should return the dayjs.isBefore return value on comparing the dates", () => {
    const { sut } = makeSut();

    const isBeforeMock = jest.fn();

    const compareResult = true;

    dayjs.prototype.isBefore = isBeforeMock.mockReturnValue(compareResult);

    const startDate = new Date("2020-01-01");
    const endDate = new Date("2020-01-02");

    const result = sut.isBefore(startDate, endDate);

    expect(result).toBe(compareResult);
  });

  it("should throw if dayjs.isBefore throws", () => {
    const { sut } = makeSut();

    const isBeforeMock = jest.fn();

    dayjs.prototype.isBefore = isBeforeMock.mockImplementation(mockError);

    const startDate = new Date("2020-01-01");
    const endDate = new Date("2020-01-02");

    expect(() => sut.isBefore(startDate, endDate)).toThrow();
  });
});
