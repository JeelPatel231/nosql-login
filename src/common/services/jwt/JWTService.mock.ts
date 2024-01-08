import { JWTService } from "./JWTService"
import * as jwt from "jsonwebtoken"

export class MockJwtService {
  static get(): JWTService {
    const service = new JWTService()
    jest.spyOn(service, 'signJwt').mockImplementation(
      async (payload: string) => 'signed_'+payload
    )

    jest.spyOn(service, 'decodeJwt').mockImplementation(
      async (token: string) => ({email: token.slice(7)} as jwt.JwtPayload)
    )

    return service
  }
}
