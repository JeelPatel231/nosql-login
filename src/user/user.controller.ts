import { Body, Controller, Get, Post } from '@nestjs/common';
import { HashService } from 'src/common/services/HashService';
import { CurrentUser } from 'src/decorators/User.decorator';
import { JwtUserPayload } from 'src/common/middleware/User.middleware';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './interface/user.interface';
import { UserService } from './user.service';
import { plainToInstance } from 'class-transformer';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly hashService: HashService,
  ) {}

  @Get('me')
  async getCurrentUser(@CurrentUser() user?: JwtUserPayload) {
    if(user == null) return "Not Logged in"

    return await this.userService.getUserFromPk(user.email)
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
