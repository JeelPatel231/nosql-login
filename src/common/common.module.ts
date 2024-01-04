import { Module } from "@nestjs/common";
import { HashService } from "src/common/services/HashService";
import { JWTService } from "src/common/services/JWTService";
import { CouchDbService } from "./services/couchbase/Connection";
import { UserService } from "src/user/user.service";
import { EmailService } from "./services/EmailService";

const CommonServices = [
  CouchDbService,
  HashService,
  JWTService,
  UserService,
  EmailService,
]

@Module({
  providers: CommonServices, 
  exports: CommonServices,
})
export class CommonModule {}
