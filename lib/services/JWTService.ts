import { Injectable } from "@nestjs/common";

import * as jwt from "jsonwebtoken"
import { CONFIG } from "./Configuration";


@Injectable()
export class JWTService {
  private readonly jwtHandler = jwt

  async signJwt<T extends object|string|Buffer>(payload: T) : Promise<string> {
    return this.jwtHandler.sign(payload, CONFIG.JWT_SECRET)
  }

  // implicitly verifies the token 
  // and returns payload if valid
  // TODO: change the return type to generic string
  async decodeJwt(token: string) : Promise<string|jwt.JwtPayload> {
    return this.jwtHandler.verify(token, CONFIG.JWT_SECRET)
  }
}