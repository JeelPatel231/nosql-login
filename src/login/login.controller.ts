import { Body, Controller, HttpException, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Request, Response, response } from 'express';
import { CouchDbService } from 'lib/services/Connection';
import { HashService } from 'lib/services/HashService';
import { JWTService } from 'lib/services/JWTService';
import { CreateUserDto, LoginUserDto } from 'lib/dto/User';
import { isDocumentNotFoundError } from 'lib/typeguards/couchbaseErrors';

@Controller('login')
export class LoginController {
  constructor(
    private readonly dbService: CouchDbService,
    private readonly hashService: HashService,
    private readonly jwtService: JWTService,
  ) {}

  @Post()
  async doLogin(@Res() response: Response, @Body() loginUserDto: LoginUserDto) {
    const userBucket = await this.dbService.userBucket()

    let userData;
    try {
      
      userData = await userBucket.defaultCollection()
        .get(loginUserDto.email)
    
    } catch(error: any) {
      
      if(isDocumentNotFoundError(error)){
        throw new HttpException('Account not found', HttpStatus.NOT_FOUND)
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
      throw new HttpException('Wrong password', HttpStatus.UNAUTHORIZED)
    }
    
    const token = await this.jwtService.signJwt({ email: loginUserDto.email })
    response.cookie("jwt", token)
    return response.sendStatus(200)
  }

}

@Controller('logout')
export class LogoutController {
  // constructor(private readonly dbService: CouchDbService) {}

  @Post()
  async doLogout(@Res() response: Response) {
    response.clearCookie("jwt")
    return response.sendStatus(200)
  }

}
