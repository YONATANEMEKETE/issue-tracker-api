import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      name: string;
      createdAt: Date;
      updatedAt: Date;
    }
    interface Request {
      user?: User;
    }
  }
}
