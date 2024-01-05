import { Controller, Get, Param, Render } from '@nestjs/common';
import { CurrentUser } from './decorators/User.decorator';
import { JwtUserPayload } from './common/middleware/User.middleware';
import { UserService } from './user/user.service';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get()
  @Render('index.hbs')
  async getHello(@CurrentUser() currentUser: JwtUserPayload) {
    if(currentUser == null) return { user: null }
    
    const userFromDb = await this.userService.getUserFromPk(currentUser.email)
    return { user: userFromDb }
  }


  @Get('login')
  @Render('auth/login.hbs')
  async loginPage() {}

  @Get('forgotpassword')
  @Render('auth/forgot-password.hbs')
  async forgotPassword() {}


  // TODO: remove this, only for debugging purposes
  @Get('setnewpassword/:token')
  @Render('auth/reset-password.hbs')
  async setNewPassword(@Param('token') jwtToken: string) {
    return { jwtToken }
  }

}
