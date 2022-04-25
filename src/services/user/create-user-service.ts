import { injectable, inject, container } from "tsyringe";

import {
  ICreateUser,
  UserUseCasePrams,
  UserUseCaseReturns,
} from "@src/domain/use-cases";
import { JWT_CONFIG } from "@src/main/config/env";
import { EmailAlreadyExistsError } from "@src/validation/errors";
import { AppError } from "@src/validation/protocols";

import { IHasherManager } from "../protocols/cryptography/hash";
import { IJwtManager } from "../protocols/cryptography/jwt";
import { IUuiDManager } from "../protocols/cryptography/uuid";
import { IDateManager } from "../protocols/date";
import { ITokenRepository } from "../protocols/db/tokens";
import { IUserRepository } from "../protocols/db/user";

@injectable()
export class CreateUserService implements ICreateUser {
  constructor(
    @inject("UsersRepository")
    private readonly usersRepository: IUserRepository,
    @inject("TokensRepository")
    private readonly tokensRepository: ITokenRepository,
    @inject("JwtFacade")
    private readonly jwtManager: IJwtManager,
    @inject("UuidFacade")
    private readonly uuidManager: IUuiDManager,
    @inject("DayjsFacade")
    private readonly dateManager: IDateManager,
    @inject("BcryptFacade")
    private readonly hasherManager: IHasherManager
  ) {}
  async create({
    email,
    name,
    password,
    avatarUrl,
  }: UserUseCasePrams["create"]): Promise<
    UserUseCaseReturns["create"] | AppError
  > {
    const emailAlreadyExists = await this.usersRepository.findByEmail({
      email,
    });

    if (emailAlreadyExists) {
      return new EmailAlreadyExistsError();
    }

    const hashedPassword = await this.hasherManager.hash(password);

    const { id, createdAt, updatedAt } = await this.usersRepository.create({
      email,
      name,
      avatarUrl,
      password: hashedPassword,
    });

    const accessToken = this.jwtManager.create(id, {
      email,
      name,
    });

    const refreshToken = this.uuidManager.gen();

    const expiresIn = this.dateManager.addDays(
      JWT_CONFIG.REFRESH_TOKEN_EXPIRES_IN_DAYS
    );

    await this.tokensRepository.create({
      expiresIn,
      token: refreshToken,
      userId: id,
    });

    return {
      user: {
        createdAt,
        email,
        id,
        name,
        updatedAt,
        avatarUrl,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }
}

container.registerSingleton<ICreateUser>(
  "CreateUserService",
  CreateUserService
);
