import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UserEntity } from "./interface/user.interface";
import { CouchDbService } from "src/common/services/couchbase/Connection";


@Injectable()
export class UserService {

  constructor(private readonly dbService: CouchDbService) {}

  // primary key, right now, is email
  async getUserFromPk(pk: string): Promise<UserEntity> {
    const userCollection = await this.dbService.getCollection("users")  
    const userFromDb = await this.dbService.try(() => userCollection.get(pk))
    return this.dbService.parseAs(UserEntity, userFromDb.content)
  }

  async createNewUser(user: UserEntity) {
    const userCollection = await this.dbService.getCollection("users")  
    await this.dbService.try(() => userCollection.insert(user.email, user))
  }

  async updateUser(user: UserEntity) {
    const userCollection = await this.dbService.getCollection("users")  
    await this.dbService.try(() => userCollection.upsert(user.email, user))
  }

}