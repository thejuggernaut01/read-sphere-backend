declare global {
  namespace Express {
    export interface Request {
      currentUser?: number;
    }
  }
}

export {}; // This line is necessary to convert the file into a module
