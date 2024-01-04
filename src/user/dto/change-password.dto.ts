import { IsString, MinLength } from "class-validator"
import { Trim } from "src/decorators/Trim.decorator"


export class SetPasswordDto {
  
  @IsString()
  @MinLength(8)
  @Trim()
  newPassword: string

}

export class ChangePasswordDto extends SetPasswordDto {
  
  @IsString()
  @MinLength(8)
  @Trim()
  oldPassword: string
  
}

