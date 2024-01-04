import { Body, Controller, Post, Res, UnauthorizedException } from "@nestjs/common";
import { Response } from "express";
import { HashService } from "src/common/services/HashService";
import { JWTService } from "src/common/services/JWTService";
import { LoginUserDto } from "src/auth/dto/login-user.dto";
import { UserService } from "src/user/user.service";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JWTService,
    private readonly hashService: HashService
  ) {}

  @Post('login')
  async login(@Res() response: Response, @Body() loginUserDto: LoginUserDto) {
    const userFromDb = await this.userService.getUserFromPk(loginUserDto.email)
    
    const isPasswordSame = await this.hashService.compare(
      loginUserDto.password,
      userFromDb.password
    )

    if(!isPasswordSame) {
      throw new UnauthorizedException('Wrong password')
    }
    
    const token = await this.jwtService.signJwt({ email: loginUserDto.email })
    response.cookie("jwt", token)
    return response.sendStatus(200)
  }


  // TODO: if we are not handling the jwt token as cookie,
  // the logout functionality will be delegated to frontend
  // then this seems to be redundant
  @Post('logout')
  async logout(@Res() response: Response) {
    response.clearCookie("jwt")
    return response.sendStatus(200)
  }

}