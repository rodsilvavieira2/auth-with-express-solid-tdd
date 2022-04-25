import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from "class-validator";

export class UpdateUserDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsEmail(undefined, { message: "Email is not valid" })
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @IsUrl()
  @IsOptional()
  avatarUrl?: string;
}
