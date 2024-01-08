import { Module } from "@nestjs/common";
import { HashService } from "src/common/services/hash/HashService";
import { JWTService } from "src/common/services/jwt/JWTService";
import { CouchDbService } from "src/common/services/couchbase/Connection";
import { UserService } from "src/user/user.service";
import { EmailService } from "src/common/services/email/EmailService";

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
