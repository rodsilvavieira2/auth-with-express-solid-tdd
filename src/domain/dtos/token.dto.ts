import { IsDate, IsJWT, IsUUID } from "class-validator";

export class TokenDTO {
  @IsJWT()
  token: string;

  @IsUUID()
  userId: string;

  @IsDate()
  expiresIn: Date;
}
