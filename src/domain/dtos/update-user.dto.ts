import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
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
  @MaxLength(255)
  avatarUrl?: string;
}
