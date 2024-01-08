import { Body, Controller, Get, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { HashService } from 'src/common/services/hash/HashService';
import { CurrentUser } from 'src/decorators/User.decorator';
import { JwtUserPayload } from 'src/common/middleware/User.middleware';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './interface/user.interface';
import { UserService } from './user.service';
import { plainToInstance } from 'class-transformer';
import { ChangePasswordDto, SetPasswordDto } from './dto/change-password.dto';
import { AuthGuard } from './user.guard';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { EmailService } from 'src/common/services/email/EmailService';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private readonly emailService: EmailService,
  ) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async getCurrentUser(@CurrentUser() user?: JwtUserPayload) {
    if(user == null) return "Not Logged in"

    return await this.userService.getUserFromPk(user.email)
  }

  // private for now, to be used with forgot password and jwt
  @UseGuards(AuthGuard)
  @Post('setnewpassword')
  async setPassword(@CurrentUser() user: JwtUserPayload, @Body() passwordDto: SetPasswordDto) {
    const userFromDb = await this.userService.getUserFromPk(user.email)
  
    const newUserData = plainToInstance(UserEntity, {
      ...userFromDb,
      password: await this.hashService.hash(passwordDto.newPassword)
    })

    this.userService.updateUser(newUserData)

    return "OK" //TODO: redirect to logout
  }


  @Post('forgotpassword')
  async forgotPassword(@Body() data: ForgotPasswordDto) {
    // check if user exists in DB, this throws if user doesnt exist
    await this.userService.getUserFromPk(data.email)

    await this.emailService.sendForgotPasswordEmail(data.email)

    return "Email sent to your account with the password reset link"
  }
 
  @UseGuards(AuthGuard)
  @Post('changepassword')
  async changePassword(@CurrentUser() user: JwtUserPayload, @Body() changePasswordDto: ChangePasswordDto) {
    const userFromDb = await this.userService.getUserFromPk(user.email)
    const isPasswordSame = await this.hashService.compare(changePasswordDto.oldPassword, userFromDb.password)

    if(!isPasswordSame) {
      throw new UnauthorizedException("Old password is wrong")
    }

    return this.setPassword(user, changePasswordDto)
  }

  @Post()
  async createUser(@Body() createAccountDto: CreateUserDto) : Promise<string> {
    const userEntity = plainToInstance(UserEntity, {
      fullName: createAccountDto.fullName,
      email: createAccountDto.email,
      password: await this.hashService.hash(createAccountDto.password),
    })
    
    await this.userService.createNewUser(userEntity)

    return "OK"
  }
}
