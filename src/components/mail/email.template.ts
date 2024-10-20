import { ENVIRONMENT } from '../../common/config/environment';

const APP_NAME = `${ENVIRONMENT.APP.NAME}`;

export const forgotPasswordEmailTemplate = (otpCode: number, name: string) => {
  return `
    <main>
      <h1>Dear ${name},</h1>
      <p>We received a request to reset your password for ${APP_NAME}. If you did not make this request, you can safely ignore this email.</p>
  
      <p>Your OTP code to reset your password is: <strong>${otpCode}</strong></p>
  
      <p>Please enter this code in the application to proceed with resetting your password. The code is valid for the next 30 minutes. If you don't use it within this timeframe, you may need to request a new code.</p>
  
      <p>If you have any questions or need further assistance, please don't hesitate to contact us at support@readsphere.com</p>
  
      <p>Best regards,<br>
          ${APP_NAME} Team</p>
    </main>
  `;
};

export const verifyEmailTemplate = (otpCode: number, name: string) => {
  return `
    <main>
      <h1>Dear ${name},</h1>

      <h2>Welcome to ${APP_NAME}! We're thrilled to have you on board.</h2>

      <p>To complete your registration and start using our app, please verify your email address by entering the following OTP code in the application:</p>

      <p>Your OTP code: <strong>${otpCode}</strong></p>

      <p>This code is valid for the next 30 minutes. If you don't verify your account within this timeframe, you may need to request a new verification code.</p>

      <p>Please note that you won't be able to access all features of the app until your email is verified.</p>

      <p>If you have any questions or need further assistance, please don't hesitate to contact us at support@readsphere.com</p>

      <p>Best regards,<br>
          ${APP_NAME} Team</p>
    </main>
  `;
};

export const welcomeEmailTemplate = (name: string) => {
  return `
    <main>
        <p>Dear ${name},</p>
    
        <p>Welcome to ${APP_NAME}! We're excited to have you join our growing community of passionate readers.</p>
    
        <p>At ${APP_NAME}, you'll find a global space where you can discover, share, and connect with fellow book lovers. Whether you're exploring new genres, joining book circles, or sharing your favorite reads, there's something for every reader here.</p>
    
        <p>If you have any questions or need assistance, feel free to reach out to us at support@readsphere.com. We're always happy to help!</p>
    
        <p>Happy Reading!</p>
    
        <p>Best regards,<br>
            ${APP_NAME} Team</p>
    </main>
  `;
};
