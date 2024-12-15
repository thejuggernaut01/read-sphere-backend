export interface IEmailJobData {
  subject: string;
  code?: number;
  user: {
    email: string;
    firstName: string;
    lastName: string;
  };
}
