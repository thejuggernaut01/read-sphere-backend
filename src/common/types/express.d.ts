declare global {
  namespace Express {
    export interface Request {
      currentUser?: string;
    }
  }
}

export {}; // This line is necessary to convert the file into a module
