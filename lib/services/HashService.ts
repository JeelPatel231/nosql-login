import { Injectable } from "@nestjs/common";

import * as bcrypt from "bcrypt"
import { CONFIG } from "./Configuration";

@Injectable()
export class HashService {
  private readonly saltRounds = parseInt(CONFIG.saltRounds)

  async hash(data: string): Promise<string>{
    return await bcrypt.hash(data, this.saltRounds)
  }

  async compare(plainText: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(plainText, hashed)
  }

}