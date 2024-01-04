import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Exclude } from 'class-transformer';

export class SavedUserDto {
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
