import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from './decorators/User.decorator';
import { JwtUserPayload } from './common/middleware/User.middleware';
import { UserService } from './user/user.service';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get()
  async getHello(@CurrentUser() currentUser: JwtUserPayload): Promise<string> {

    if(currentUser == null) {
      return "Hello World (not logged in)"
    }

    const userFromDb = await this.userService.getUserFromPk(currentUser.email)
  
    return `Hello, ${userFromDb.fullName}`
  }
}
