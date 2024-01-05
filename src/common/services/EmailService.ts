import { Injectable } from "@nestjs/common";

import * as nodemailer from "nodemailer"
import { CONFIG } from "src/app.configuration";
import { JWTService } from "./JWTService";

export type MailDetails = {
  to: string,
  subject: string,
  htmlBody: string
}

@Injectable()
export class EmailService {

  constructor(private readonly jwtService: JWTService) {}

  private readonly mailer = nodemailer.createTransport({
    host: CONFIG.SMTP_HOST,
    port: parseInt(CONFIG.SMTP_PORT, 10),
    secure: false,
    auth : {
      user: CONFIG.EMAIL_USERNAME,
      pass: CONFIG.EMAIL_PASSWORD
    }
  })

  private async sendEmail(mail: MailDetails) {
    this.mailer.sendMail({
      from: CONFIG.EMAIL_USERNAME,
      to: mail.to,
      subject: mail.subject,
      html: mail.htmlBody, 
    })
  }

  async sendForgotPasswordEmail(to: string) {
    const jwtToken = await this.jwtService.signJwt({ email: to })
    
    const htmlBody = `
      <a href="https://example.com/setnewpassword/${jwtToken}">
        Click here to change password
      </a>
    `

    await this.sendEmail({
      to: to,
      subject: "Forgot Password",
      htmlBody: htmlBody,
    })
  }

}
