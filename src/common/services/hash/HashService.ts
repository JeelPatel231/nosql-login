import { Injectable } from "@nestjs/common";

import * as bcrypt from "bcrypt"
import { CONFIG } from "src/app.configuration";

@Injectable()
export class HashService {
  private readonly saltRounds = parseInt(CONFIG.SALT_ROUNDS)

  async hash(data: string): Promise<string>{
    return await bcrypt.hash(data, this.saltRounds)
  }

  async compare(plainText: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(plainText, hashed)
  }

}