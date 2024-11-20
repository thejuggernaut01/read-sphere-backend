import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import smtpexpressClient from './config';
import { ENVIRONMENT } from '../../common/config/environment';
import {
  forgotPasswordEmailTemplate,
  verifyEmailTemplate,
  welcomeEmailTemplate,
} from './email.template';
import { ERROR_CONSTANT } from '../../common/constants/error.constant';

interface IUserEmail {
  email: string;
  firstName: string;
  lastName: string;
}

@Injectable()
export class MailService {
  async sendVerificationEmail(subject: string, code: number, user: IUserEmail) {
    const response = await smtpexpressClient.sendApi.sendMail({
      subject: subject,
      message: verifyEmailTemplate(code, user.firstName),
      sender: {
        name: ENVIRONMENT.APP.NAME,
        email: ENVIRONMENT.SMTP.SENDER_ADDRESS,
      },
      recipients: {
        name: user.firstName + ' ' + user.lastName,
        email: user.email,
      },
    });

    if (response.statusCode !== 200) {
      throw new ServiceUnavailableException(
        ERROR_CONSTANT.EMAIL.FAILED_TO_SEND,
      );
    }

    return response;
  }

  async sendForgotPasswordEmail(
    subject: string,
    code: number,
    user: IUserEmail,
  ) {
    const response = await smtpexpressClient.sendApi.sendMail({
      subject: subject,
      message: forgotPasswordEmailTemplate(code, user.firstName),
      sender: {
        name: ENVIRONMENT.APP.NAME,
        email: ENVIRONMENT.SMTP.SENDER_ADDRESS,
      },
      recipients: {
        name: user.firstName + ' ' + user.lastName,
        email: user.email,
      },
    });

    if (response.statusCode !== 200) {
      throw new ServiceUnavailableException(
        ERROR_CONSTANT.EMAIL.FAILED_TO_SEND,
      );
    }

    return response;
  }

  async sendWelcomeEmail(subject: string, user: IUserEmail) {
    const response = await smtpexpressClient.sendApi.sendMail({
      subject: subject,
      message: welcomeEmailTemplate(user.firstName),
      sender: {
        name: ENVIRONMENT.APP.NAME,
        email: ENVIRONMENT.SMTP.SENDER_ADDRESS,
      },
      recipients: {
        name: user.firstName + ' ' + user.lastName,
        email: user.email,
      },
    });

    if (response.statusCode !== 200) {
      throw new ServiceUnavailableException(
        ERROR_CONSTANT.EMAIL.FAILED_TO_SEND,
      );
    }

    return response;
  }
}
