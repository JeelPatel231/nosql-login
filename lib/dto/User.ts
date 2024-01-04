import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { IsEqualTo, Match } from 'src/decorators/Match.decorator';
import { Exclude } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  fullName: string

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  // TODO: check for post validation tranformations
  // for hashing password
  password: string;

  @IsString()
  @MinLength(8)
  @IsEqualTo('password')
  @Exclude({ toPlainOnly: true })
  confirmPassword: string;

}

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


export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}