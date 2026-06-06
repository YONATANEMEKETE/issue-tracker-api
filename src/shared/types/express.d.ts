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

    interface WorkspaceMembership {
      id: string;
      userId: string;
      workspaceId: string;
      role: WorkspaceRole;
      joinedAt: Date;
    }

    interface Request {
      user?: User;
      membership?: WorkspaceMembership;
    }
  }
}
