import { Controller, Get } from '@nestjs/common';
import { Cookies } from './decorators/Cookie.decorator';
import { CouchDbService } from 'src/common/services/Connection';
import { JWTService } from 'src/common/services/JWTService';
import { plainToInstance } from 'class-transformer';
import { SavedUserDto } from 'lib/dto/User';
import { CurrentUser } from './decorators/User.decorator';
import { JwtUserPayload } from './common/middleware/User.middleware';

@Controller()
export class AppController {
  constructor(
    private readonly dbService: CouchDbService,
    private readonly jwtService: JWTService
  ) {}

  @Get()
  async getHello(@CurrentUser() currentUser: JwtUserPayload): Promise<string> {

    if(currentUser == null) {
      return "Hello World (not logged in)"
    }

    const userCollection = await this.dbService.getCollection("user")
    const userFromDb = await userCollection.get(currentUser.email)
  
    const validated = plainToInstance(SavedUserDto, userFromDb.value)

    return `Hello, ${validated.fullName}`
  }
}
