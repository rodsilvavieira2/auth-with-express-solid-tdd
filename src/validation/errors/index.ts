import { AppError } from "../protocols";

export class EmailAlreadyExistsError extends AppError {
  constructor() {
    super("auth.email_already_exists", "email already exists");
    this.name = "EmailAlreadyExistsError";
  }
}

export class UserNotFoundError extends AppError {
  constructor() {
    super("auth.user-not-found", "the user could be not found", 404);
    this.name = "UserNotFoundError";
  }
}

export class TokenNotFoundError extends AppError {
  constructor() {
    super("token.not-found", "the token could be not found", 404);
    this.name = "TokenNotFoundError";
  }
}

export class InvalidCredentialsError extends AppError {
  constructor() {
    super("auth.invalid-credentials", "invalid credentials", 401);
    this.name = "InvalidCredentialsError";
  }
}

export class InvalidRefreshTokenError extends AppError {
  constructor() {
    super("refresh-token.invalid", "invalid refresh token", 401);
    this.name = "InvalidRefreshTokenError";
  }
}

export class ExpiredRefreshTokenError extends AppError {
  constructor() {
    super("refresh-token.expired", "expired refresh token", 401);
    this.name = "ExpiredRefreshTokenError";
  }
}

export class RefreshTokenNotFoundError extends AppError {
  constructor() {
    super("refresh-token.not-found", "not found refresh token", 404);
    this.name = "RefreshTokenNotFoundError";
  }
}

export class InvalidAccessTokenError extends AppError {
  constructor() {
    super("auth.invalid-access-token", "invalid access token", 401);
    this.name = "InvalidAccessTokenError";
  }
}

export class MissingAccessToken extends AppError {
  constructor() {
    super("auth.missing-access-token", "missing access token", 401);
    this.name = "MissingAccessToken";
  }
}
