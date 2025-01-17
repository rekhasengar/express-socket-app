import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { serveSwagger } from '../src/privateLibs/swagger-generator-express';
import RequestContext from './helpers/context';
import ResponseHandler from './helpers/responseHandler';
import { DEFAULT_LOCALE, isProduction, serverConfig, SUPPORTED_LOCALE } from './config';
import EmailService from './utils/email';
import { AppDataSource } from './database/mysql/typeormConfig';
import constants from './constants';
import CustomError from './shared/errorHandler/customError';
import SocketConnector from './socket/socketConnector';
import processRoleSeeder from './seeders/roleSeeder';
import blockedAt from 'blocked-at';

const app = express();

if (!isProduction) {
  EmailService.loadTestAccount();
}

app.use(cors());
app.use(helmet());

// request payload middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//app.use(useragent.express());

// This is usually caused by synchronous operations that delay the event loop, such as long loop , disk I/O, or database operations.
// AsyncHook.init: This is part of the blocked-at package's internal tracking of asynchronous operations.
blockedAt(
  (time: any, stack: any, resourceType: any) => {
    console.log('+++++++++++++++++++++++++++++++++');
    console.info({ message: `Blocked for ${time}ms` });
    console.info({ message: `Stack trace:\n${JSON.stringify(stack)}` });
    console.info({ message: `Resource type: ${JSON.stringify(resourceType)}` });
  },
  { threshold: 20 },
);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});

SocketConnector.initialize(io);

const xRequestId = constants.GENERATE_UUID_V4();
(async () => {
  try {
    await AppDataSource.initialize();
    await processRoleSeeder();
    console.log({ message: constants.MY_SQL_CONNECTED_SUCCESSFULLY });
  } catch (error) {
    console.log({
      message: constants.MY_SQL_UNABLE_TO_CONNECT,
      error: error,
      source: '#serverFile',
      requestId: xRequestId,
    });
  }
})();

const swaggerOptions = {
  title: 'express-ts-sql',
  version: '1.0.0',
  host: 'localhost:3000',
  basePath: '/',
  schemes: ['https', 'http'],
  securityDefinitions: {
    Bearer: {
      description:
        'Example value:- Bearer eyJhbGciOiJIUzI1NiJ9.eyJOYW1lIjoiUml0aWsgSmFpbiJ9.OENs7sVbpa5BpVH0LkqH5V0uuqwsfizV2u1Psa_G6R0',
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
    },
  },
  parameters: {
    timezone: {
      description: 'Asia/Calcutta',
      locale: 'en',
      type: 'string',
      name: 'timezone',
      in: 'header',
    },
    urlDomain: {
      description: 'localhost',
      type: 'string',
      name: 'urlDomain',
      in: 'header',
    },
  },
  security: [{ Bearer: [] }],
  defaultSecurity: 'Bearer',
};

const port = serverConfig.port;

// Middleware to initialize request context
app.use((req: Request, res: Response, next: NextFunction) => {
  req.context = new RequestContext(req);
  let locale =
    (req.headers['Accept-Language'] as string) || (req.headers['accept-language'] as string) || DEFAULT_LOCALE;
  locale = SUPPORTED_LOCALE.includes(locale) ? locale : DEFAULT_LOCALE;
  req.locale = locale;
  next();
});

app.get('/health', function (req: Request, res: Response) {
  req.context.logInfo({
    message: 'Health check completed',
    source: 'heath',
    action: 'healthcheck',
  });
  const response = new ResponseHandler(req, res);
  return response.successResponse('okay');
});

/**
 * ----------------------------- Start of V1 APIs ------------------------
 */
fs.readdirSync(path.resolve(__dirname, 'routes', 'v1')).forEach((file) => {
  if (!file.includes('.js.') && !file.includes('.ts.') && !file.includes('.d.ts')) {
    console.log(file);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { router, basePath } = require(`./routes/v1/${file}`);
    app.use(basePath, router);
  }
});

/**
 * ----------------------------- Start of V2 APIs ------------------------
 */

fs.readdirSync(path.resolve(__dirname, 'routes', 'v2')).forEach((file) => {
  if (!file.includes('.js.') && !file.includes('.ts.') && !file.includes('.d.ts')) {
    console.log(file);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { router, basePath } = require(`./routes/v2/${file}`);
    app.use(basePath, router);
  }
});

const server = httpServer.listen(port, () => {
  console.info(`Started on port : ${port}`);
});

serveSwagger(app, '/swagger', swaggerOptions, {
  routePath: '../../routes/v1',
  requestModelPath: '../../requestModels',
  responseModelPath: '../../responseModels',
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.get('*', function (req: Request, res: Response, _next: NextFunction) {
  const response = new ResponseHandler(req, res);
  return response.notFoundError('APIs route not found', 'RequestNotFound');
});

// error handler middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(function (err: Error, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof CustomError) {
    return CustomError.errorHandler(err, res);
  }
  let locale = (req.headers['Accept-Language'] as string) || DEFAULT_LOCALE;
  locale = SUPPORTED_LOCALE.includes(locale) ? locale : DEFAULT_LOCALE;
  const response = new ResponseHandler(req, res);
  return response.handleError(locale, err);
});

module.exports = server;
