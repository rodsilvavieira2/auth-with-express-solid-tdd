import { sign } from "jsonwebtoken";
import request from "supertest";

import faker from "@faker-js/faker";
import { prismaClient } from "@src/infra/db/postgres";
import { setUpApp } from "@src/main/config/app";
import { JWT_CONFIG } from "@src/main/config/env";
import { createUserMock } from "@src/mocks/models";

describe("Users Routes", () => {
  let app: request.SuperTest<request.Test>;

  beforeAll(async () => {
    app = request(await setUpApp());
  });

  const baseUrl = "/api/users";

  describe("DELETE: USERS", () => {
    it("should delete a existing user", async () => {
      const { id: userId } = await prismaClient.users.create({
        data: {
          ...createUserMock(),
        },
      });

      const accessToken = sign({}, JWT_CONFIG.ACCESS_TOKEN_SECRET, {
        subject: userId,
      });

      await app
        .delete(`${baseUrl}/${userId}`)
        .set({
          Authorization: `Bearer ${accessToken}`,
        })
        .expect(204);
    });

    it("should not delete a not existing user", async () => {
      const userId = faker.datatype.uuid();

      const { id } = await prismaClient.users.create({
        data: {
          ...createUserMock(),
        },
      });

      const accessToken = sign({}, JWT_CONFIG.ACCESS_TOKEN_SECRET, {
        subject: id,
      });

      await app
        .delete(`${baseUrl}/${userId}`)
        .set({
          Authorization: `Bearer ${accessToken}`,
        })
        .expect(404);
    });

    it("should not accept a invalid jwt token", async () => {
      const invalidToken = sign({}, "invalid_secret");

      const userId = faker.datatype.uuid();

      await app
        .delete(`${baseUrl}/${userId}`)
        .set({
          Authorization: `Bearer ${invalidToken}`,
        })
        .expect(401);
    });

    it("should not accept a expired jwt token", async () => {
      const invalidToken = sign({}, JWT_CONFIG.ACCESS_TOKEN_SECRET, {
        expiresIn: "-1s",
      });

      const userId = faker.datatype.uuid();

      await app
        .delete(`${baseUrl}/${userId}`)
        .set({
          Authorization: `Bearer ${invalidToken}`,
        })
        .expect(401);
    });
  });

  describe("GET: USERS", () => {
    it("should get a registered user by id", async () => {
      const { id: userId } = await prismaClient.users.create({
        data: {
          ...createUserMock(),
        },
      });
      const accessToken = sign({}, JWT_CONFIG.ACCESS_TOKEN_SECRET, {
        subject: userId,
      });

      await app
        .get(`${baseUrl}/${userId}`)
        .set({
          Authorization: `Bearer ${accessToken}`,
        })
        .expect(200);
    });

    it("should not get a not registered user by id", async () => {
      const invalidUserId = faker.datatype.uuid();

      const { id: userId } = await prismaClient.users.create({
        data: {
          ...createUserMock(),
        },
      });

      const accessToken = sign({}, JWT_CONFIG.ACCESS_TOKEN_SECRET, {
        subject: userId,
      });

      await app
        .get(`${baseUrl}/${invalidUserId}`)
        .set({
          Authorization: `Bearer ${accessToken}`,
        })
        .expect(404);
    });

    it("should not accept a invalid jwt", async () => {
      const invalidAccessToken = sign({}, "any_secret_key");

      const userId = faker.datatype.uuid();

      await app
        .get(`${baseUrl}/${userId}`)
        .set({
          Authorization: `Bearer ${invalidAccessToken}`,
        })
        .expect(401);
    });

    it("should not accept a expired jwt", async () => {
      const invalidAccessToken = sign({}, JWT_CONFIG.ACCESS_TOKEN_SECRET, {
        expiresIn: "-1s",
      });

      const userId = faker.datatype.uuid();

      await app
        .get(`${baseUrl}/${userId}`)
        .set({
          Authorization: `Bearer ${invalidAccessToken}`,
        })
        .expect(401);
    });
  });

  describe("PATCH: USERS", () => {
    it("should update a registered", async () => {
      const { id: userId } = await prismaClient.users.create({
        data: {
          ...createUserMock(),
        },
      });

      const newData = createUserMock();

      const accessToken = sign({}, JWT_CONFIG.ACCESS_TOKEN_SECRET, {
        subject: userId,
      });

      await app
        .patch(`${baseUrl}/${userId}`)
        .send(newData)
        .set({
          Authorization: `Bearer ${accessToken}`,
        })
        .expect(200);
    });

    it("should not update a not registered user by id", async () => {
      const invalidUserId = faker.datatype.uuid();

      const { id: userId } = await prismaClient.users.create({
        data: {
          ...createUserMock(),
        },
      });

      const accessToken = sign({}, JWT_CONFIG.ACCESS_TOKEN_SECRET, {
        subject: userId,
      });

      const newData = createUserMock();

      await app
        .patch(`${baseUrl}/${invalidUserId}`)
        .send(newData)
        .set({
          Authorization: `Bearer ${accessToken}`,
        })
        .expect(404);
    });

    it("should not accept a invalid jwt", async () => {
      const invalidAccessToken = sign({}, "any_secret_key");

      const userId = faker.datatype.uuid();

      const newData = createUserMock();

      await app
        .patch(`${baseUrl}/${userId}`)
        .send(newData)
        .set({
          Authorization: `Bearer ${invalidAccessToken}`,
        })
        .expect(401);
    });

    it("should not accept a expired jwt", async () => {
      const invalidAccessToken = sign({}, JWT_CONFIG.ACCESS_TOKEN_SECRET, {
        expiresIn: "-1s",
      });

      const userId = faker.datatype.uuid();

      const newData = createUserMock();

      await app
        .patch(`${baseUrl}/${userId}`)
        .send(newData)
        .set({
          Authorization: `Bearer ${invalidAccessToken}`,
        })
        .expect(401);
    });
  });
});
