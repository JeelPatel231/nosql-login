import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Exclude, plainToInstance } from 'class-transformer';

export class UserEntity {
  @IsString()
  @IsNotEmpty()
  fullName: string

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Exclude({ toPlainOnly : true })
  password: string;

}