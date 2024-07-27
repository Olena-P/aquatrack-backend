import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pino from 'pino-http';
import session from 'express-session';
import morgan from 'morgan';
import { env } from './utils/env.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import rootRouter from './routes/index.js';
import { errorHandler } from './middlewares/errorHandlers.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';
import { UPLOAD_DIR } from './constants/index.js';

dotenv.config();

const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  // app.use(
  //   express.json({
  //     type: ['application/json', 'application/vnd.api+json'],
  //     limit: '100kb',
  //   }),
  // );

  // app.use(express.json());

  app.use((req, res, next) => {
    if (req.is('application/json')) {
      express.json()(req, res, next);
    } else {
      next();
    }
  });

  app.use(express.urlencoded({ extended: true }));

  app.use(cookieParser());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
  app.use(
    cors({
      origin: (origin, callback) => {
        const allowedOrigins = [
          'http://localhost:5173/',
          'https://50-85-front.vercel.app/',
        ];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    }),
  );
  app.use(helmet());

  app.use(morgan('combined'));

  app.use(
    session({
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: true },
    }),
  );

  // TODO
  app.get('/', (req, res) => {
    res.send(`
      <p>Go to <a href="/water">water...</a></p>
    `);
  });

  app.use('/uploads', express.static(UPLOAD_DIR));

  app.use('/api-docs', swaggerDocs());

  app.use(rootRouter);

  app.use('*', notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
