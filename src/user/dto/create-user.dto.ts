import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Trim } from "src/decorators/Trim.decorator";

export class CreateUserDto {

  @IsString()
  @IsNotEmpty()
  @Trim()
  fullName: string

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Trim()
  password: string;

}
