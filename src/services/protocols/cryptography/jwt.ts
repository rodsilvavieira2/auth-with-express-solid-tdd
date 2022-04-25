export type JwtPayloadReturn<T = unknown> = {
  iat: number;
  exp: number;
  sub: string;
} & T;

export interface IJwtManager {
  create(sub: string, payload: unknown): string;
  verify(token: string): boolean;
  decode(token: string): JwtPayloadReturn<unknown>;
}
