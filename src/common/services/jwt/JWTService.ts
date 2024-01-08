import { Injectable } from "@nestjs/common";

import * as jwt from "jsonwebtoken"
import { CONFIG } from "src/app.configuration";


@Injectable()
export class JWTService {
  private readonly jwtHandler = jwt

  async signJwt<T extends object|string|Buffer>(payload: T) : Promise<string> {
    return this.jwtHandler.sign(payload, CONFIG.JWT_SECRET)
  }

  // implicitly verifies the token 
  // and returns payload if valid
  // TODO: change the return type to generic string
  async decodeJwt(token: string) : Promise<jwt.JwtPayload> {
    const decoded = this.jwtHandler.verify(token, CONFIG.JWT_SECRET)

    if('string' === typeof decoded) {
      throw new Error(`Decoded type was string with value, ${decoded}`)
    }

    return decoded
  }
}