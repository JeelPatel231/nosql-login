import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { CouchDbService } from 'src/common/services/Connection';
import { HashService } from 'src/common/services/HashService';
import { isDocumentExistsError } from 'lib/typeguards/couchbaseErrors';
import { CurrentUser } from 'src/decorators/User.decorator';
import { JwtUserPayload } from 'src/common/middleware/User.middleware';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly dbService: CouchDbService,
    private readonly hashService: HashService,
  ) {}

  @Get('me')
  async getCurrentUser(@CurrentUser() user?: JwtUserPayload) {
    if(user == null) return "Not Logged in"
    return user.email;
  }
 
  @Post()
  async createUser(@Body() createAccountDto: CreateUserDto) : Promise<string> {
    const userCollection = await this.dbService.getCollection("user")

    // change the password to its hashed value
    createAccountDto.password = await this.hashService.hash(createAccountDto.password)
    
    // exclude any unwanted properties, described in DTO
    const serialized = instanceToPlain(createAccountDto)

    try {
      await userCollection.insert(createAccountDto.email, serialized)
    } catch(error: unknown) {
      if(isDocumentExistsError(error)) {
        throw new BadRequestException('Account already exists')
      }

      throw error
    }

    return "OK"
  }
}
