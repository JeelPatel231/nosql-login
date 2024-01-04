import { Body, Controller, NotFoundException, NotImplementedException, Post, Res, UnauthorizedException } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { Response } from "express";
import { CouchDbService } from "src/common/services/Connection";
import { HashService } from "src/common/services/HashService";
import { JWTService } from "src/common/services/JWTService";
import { isDocumentNotFoundError } from "lib/typeguards/couchbaseErrors";
import { LoginUserDto } from "src/auth/dto/login-user.dto";
import { CreateUserDto } from "src/user/dto/create-user.dto";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly dbService: CouchDbService,
    private readonly jwtService: JWTService,
    private readonly hashService: HashService
  ) {}

  @Post('login')
  async login(@Res() response: Response, @Body() loginUserDto: LoginUserDto) {
    const userBucket = await this.dbService.userBucket()

    let userData;
    try {
      
      userData = await userBucket.defaultCollection()
        .get(loginUserDto.email)
    
    } catch(error: any) {
      
      if(isDocumentNotFoundError(error)){
        throw new NotFoundException('Account not found')
      }

      // throw the unhandled error
      throw error
    }

    const validatedUserData = plainToInstance(CreateUserDto, userData.value)
    const isPasswordSame = await this.hashService.compare(
      loginUserDto.password,
      validatedUserData.password
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