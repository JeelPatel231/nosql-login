import { MockJwtService } from "../jwt/JWTService.mock"
import { EmailService } from "./EmailService"


export class MockEmailService {
  static get() : EmailService {
    const emailService = new EmailService(MockJwtService.get())
    
    jest.spyOn(emailService, "sendForgotPasswordEmail").mockImplementation(
      async (to: string) => console.log("Email sent to", to)
    )

    return emailService
  }
}