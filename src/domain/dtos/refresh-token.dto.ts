import { IsUUID } from "class-validator";

export class RefreshTokenDTO {
  @IsUUID()
  refreshToken: string;
}
