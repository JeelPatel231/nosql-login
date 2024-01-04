import { Module } from "@nestjs/common";
import { CouchDbService } from "src/common/services/Connection";
import { HashService } from "src/common/services/HashService";
import { JWTService } from "src/common/services/JWTService";

@Module({
  providers: [CouchDbService,HashService,JWTService],
  exports: [CouchDbService,HashService,JWTService],
})
export class CommonModule {}
