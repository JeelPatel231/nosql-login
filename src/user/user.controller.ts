import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { CouchDbService } from 'src/common/services/Connection';
import { HashService } from 'src/common/services/HashService';
import { CreateUserDto } from 'lib/dto/User';
import { isDocumentExistsError } from 'lib/typeguards/couchbaseErrors';

@Controller('user')
export class UserController {
  constructor(
    private readonly dbService: CouchDbService,
    private readonly hashService: HashService,
  ) {}
 
  @Post()
  async createUser(@Body() createAccountDto: CreateUserDto) : Promise<string> {
    const userBucket = await this.dbService.userBucket()

    // change the password to its hashed value
    createAccountDto.password = await this.hashService.hash(createAccountDto.password)
    
    // exclude any unwanted properties, described in DTO
    const serialized = instanceToPlain(createAccountDto)

    try {
      await userBucket
        .defaultCollection()
        .insert(createAccountDto.email, serialized)
    } catch(error: unknown) {
      if(isDocumentExistsError(error)) {
        throw new BadRequestException('Account already exists')
      }

      throw error
    }

    return "OK"
  }
}
