import { Module } from "@nestjs/common";
import { HashService } from "src/common/services/HashService";
import { JWTService } from "src/common/services/JWTService";
import { CouchDbService } from "./services/couchbase/Connection";
import { UserService } from "src/user/user.service";

@Module({
  providers: [CouchDbService,HashService,JWTService, UserService],
  exports: [CouchDbService,HashService,JWTService, UserService],
})
export class CommonModule {}
