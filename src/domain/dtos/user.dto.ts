import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from "class-validator";

export class UserDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail(undefined, { message: "Email is not valid" })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsUrl()
  @IsOptional()
  avatarUrl?: string;
}
