export interface ICreateUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  termsAcceptedAt: Date;
}

export interface IUpdateUser {
  firstName: string;
  lastName: string;
  email: string;
  refreshToken: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IVerifyEmail {
  email: string;
  code: number;
}

export interface IResendVerifyEmail {
  email: string;
}

export interface IForgotPassword {
  email: string;
}

export interface IResetPassword {
  token: string;
  password: string;
}
