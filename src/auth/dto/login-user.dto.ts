import { Transform } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";
import { Trim } from "src/decorators/Trim.decorator";

export class LoginUserDto {
  @Trim()
  @IsEmail()
  email: string;

  @Trim()
  @IsString()
  @MinLength(8)
  password: string;
}