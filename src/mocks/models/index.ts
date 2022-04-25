import faker from "@faker-js/faker";
import { User, Token } from "@src/domain/models";

export function createUserMock(): User {
  return {
    id: faker.datatype.uuid(),
    email: faker.internet.email(),
    name: faker.name.findName(),
    password: faker.internet.password(),
    avatarUrl: faker.internet.avatar(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  };
}

export function createTokenMock(): Token {
  return {
    id: faker.datatype.uuid(),
    token: faker.datatype.uuid(),
    expiresIn: faker.date.future(),
    userId: faker.datatype.uuid(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  };
}
