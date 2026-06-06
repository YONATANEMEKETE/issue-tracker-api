import express from 'express';
import { requestLogger } from './shared/middlewares/request-logger.js';
import { errorHandler } from './shared/middlewares/error-handler.js';
import { notFoundHandler } from './shared/middlewares/notfound-handler.js';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import pg from 'pg';
import { config } from './shared/configs/env.js';
import { authRouter } from './features/auth/auth.router.js';
import { deserializeUser } from './features/auth/auth.middleware.js';
import { workspaceRouter } from './features/workspace/workspace.router.js';

export const app = express();

const PostgresStore = pgSession(session);
const pool = new pg.Pool({
  connectionString: config.DATABASE_URL,
});

app.use(requestLogger);
app.use(express.json());

app.use(
  session({
    store: new PostgresStore({
      pool,
      tableName: 'session',
      createTableIfMissing: false,
    }),
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: 'sid',
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true,
      sameSite: 'lax',
      secure: config.NODE_ENV === 'production',
    },
  }),
);

app.use(deserializeUser);
app.use('/auth', authRouter);
app.use('/workspaces', workspaceRouter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use(notFoundHandler);
app.use(errorHandler);
