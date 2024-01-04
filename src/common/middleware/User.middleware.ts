import { BadRequestException, createParamDecorator, ExecutionContext, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JWTService } from '../services/JWTService';

export type JwtUserPayload = {
  email: string
}

type ExtendedRequest = Request & {
  user: JwtUserPayload
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {

  constructor(private readonly jwtService: JWTService){}

  async use(req: ExtendedRequest, res: Response, next: NextFunction) {
    const jwtToken = req.cookies["jwt"];

    if(jwtToken == null) {
      return next()
    }

    try {
      const decodedRaw = await this.jwtService.decodeJwt(jwtToken)

      if(typeof decodedRaw == 'string') {
        throw new BadRequestException('Return type of jwt decode was string')
      } 
      
      req.user = (decodedRaw as JwtUserPayload)
    } catch(e: unknown) {
      // log and ignore the error because auth isnt mandatory
      console.error("jwt decode failed", e)
    }
    
    next();

  }
}