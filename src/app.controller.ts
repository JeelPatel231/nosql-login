import { Controller, Get } from '@nestjs/common';
import { Cookies } from './decorators/Cookie.decorator';
import { CouchDbService } from 'src/common/services/Connection';
import { JWTService } from 'src/common/services/JWTService';
import { plainToInstance } from 'class-transformer';
import { SavedUserDto } from 'lib/dto/User';

@Controller()
export class AppController {
  constructor(
    private readonly dbService: CouchDbService,
    private readonly jwtService: JWTService
  ) {}

  // TODO: make an authentication middleware 
  // to pass the current user around 
  // all over the app

  @Get()
  async getHello(@Cookies('jwt') jwtToken: string): Promise<string> {

    if(jwtToken == null) {
      return "Hello World (not logged in)"
    }

    const decodedPayload = await this.jwtService.decodeJwt(jwtToken)

    if(typeof decodedPayload == 'string'){
      return decodedPayload
    }

    const userBucket = await this.dbService.userBucket()
    const userFromDb = await userBucket.defaultCollection()
      .get(decodedPayload.email)
  
    const validated = plainToInstance(SavedUserDto, userFromDb.value)

    return `Hello, ${validated.fullName}`
  }
}
