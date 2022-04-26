import { hash } from "bcrypt";
import request from "supertest";

import faker from "@faker-js/faker";
import { prismaClient } from "@src/infra/db/postgres";
import { createUserMock } from "@src/mocks/models";

import { setUpApp } from "../../main/config/app";

describe("Auth Routes", () => {
  let app: request.SuperTest<request.Test>;

  beforeAll(async () => {
    app = request(await setUpApp());
  });

  describe("POST: signup", () => {
    const baseUrl = "/api/signup";

    it("should create a new user", async () => {
      const user = {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await app.post(baseUrl).send(user).expect(201);
    });

    it("should not create a new user if sent invalids params", async () => {
      const user = {
        name: faker.name.findName(),
        email: "invalid_email",
        password: faker.internet.password(),
      };

      await app.post(baseUrl).send(user).expect(400);
    });
  });

  describe("POST: session", () => {
    const baseUrl = "/api/login";
    it("should authenticate a user with valid credentials", async () => {
      const password = faker.internet.password();
      const email = faker.internet.email();
      const name = faker.name.findName();

      await prismaClient.users.create({
        data: {
          password: await hash(password, 1),
          email,
          name,
        },
      });

      await app
        .post(baseUrl)
        .send({
          email,
          password,
        })
        .expect(200);
    });

    it("should not authenticate a user with invalid credentials", async () => {
      const password = faker.internet.password();
      const email = faker.internet.email();
      const name = faker.name.findName();

      await prismaClient.users.create({
        data: {
          password: await hash(password, 1),
          email,
          name,
        },
      });

      await app
        .post(baseUrl)
        .send({
          email,
          password: "invalid",
        })
        .expect(401);
    });

    it("should not accept invalid params", async () => {
      await app
        .post(baseUrl)
        .send({
          email: "invalid",
          password: "invalid",
        })
        .expect(400);
    });
  });

  describe("POST: refresh-token", () => {
    const baseUrl = "/api/refresh-token";
    it("should generate new tokens given a valid refresh token", async () => {
      const refreshToken = faker.datatype.uuid();

      const { id: userId } = await prismaClient.users.create({
        data: {
          ...createUserMock(),
        },
      });

      await prismaClient.tokens.create({
        data: {
          expiresIn: faker.date.future(),
          token: refreshToken,
          userId,
        },
      });

      await app.post(baseUrl).send({ refreshToken }).expect(200);
    });

    it("should not generate new tokens given a unregistered refresh token ", async () => {
      const refreshToken = faker.datatype.uuid();

      await app.post(baseUrl).send({ refreshToken }).expect(404);
    });

    it("should not accept a expired refresh token", async () => {
      const refreshToken = faker.datatype.uuid();

      const expiresIn = faker.date.past();

      const { id: userId } = await prismaClient.users.create({
        data: {
          ...createUserMock(),
        },
      });

      await prismaClient.tokens.create({
        data: {
          expiresIn,
          token: refreshToken,
          userId,
        },
      });

      await app.post(baseUrl).send({ refreshToken }).expect(401);
    });

    it("should not accept an invalid uuid format", async () => {
      const refreshToken = "invalid_format";

      await app.post(baseUrl).send({ refreshToken }).expect(400);
    });
  });
});
