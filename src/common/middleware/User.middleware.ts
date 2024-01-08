import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JWTService } from 'src/common/services/jwt/JWTService';

export type JwtUserPayload = {
  email: string
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {

  constructor(private readonly jwtService: JWTService){}

  async use(req: Request, res: Response, next: NextFunction) {
    const jwtToken = req.cookies["jwt"];

    if(jwtToken == null) {
      return next()
    }

    try {
      const decodedRaw = await this.jwtService.decodeJwt(jwtToken)
      req.user = decodedRaw as JwtUserPayload
    } catch(e: unknown) {
      // log and ignore the error because auth isnt mandatory
      console.error("jwt decode failed", e)
    }
    
    next();

  }
}