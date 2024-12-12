interface ICreateUser {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  termsAcceptedAt: Date;
}

interface IUpdateUser {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
}

interface ILogin {
  email: string;
  password: string;
}

interface IVerifyEmail {
  email: string;
  code: number;
}

interface IResendVerifyEmail {
  email: string;
}

interface IForgotPassword {
  email: string;
}

interface IResetPassword {
  token: string;
  password: string;
}

export {
  ICreateUser,
  IUpdateUser,
  ILogin,
  IVerifyEmail,
  IResendVerifyEmail,
  IForgotPassword,
  IResetPassword,
};
