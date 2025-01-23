import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import httpStatusCode from 'http-status-codes';
import swagger from 'express-joi-swagger-spec';
import responseTime from 'response-time';
// import blockedAt from 'blocked-at';
import path from 'path';
import { fork } from 'child_process';

import RequestContext from './helpers/context';
import { DEFAULT_LOCALE, isProduction, serverConfig, SUPPORTED_LOCALE } from './config';
import EmailService from './utils/email';
import constants from './constants';
import CustomError from './shared/errorHandler/customError';
import SocketConnector from './socket/socketConnector';
import v1Router from './routes/v1';
import databaseConnection from './database/mysql/connection';

const app = express();

if (!isProduction) {
  EmailService.loadTestAccount();
}

app.use(cors());
//facing issue - Content-Security-Policy From client side that why i am hiding the helmet yet
// app.use(helmet());

// request payload middleware
app.use(express.json());
app.use(responseTime());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// This is usually caused by synchronous operations that delay the event loop, such as long loop , disk I/O, or database operations.
// AsyncHook.init: This is part of the blocked-at package's internal tracking of asynchronous operations.
// blockedAt(
//   (time: any, stack: any, resourceType: any) => {
//     console.log('+++++++++++++++++++++++++++++++++');
//     console.info({ message: `Blocked for ${time}ms` });
//     console.info({ message: `Stack trace:\n${JSON.stringify(stack)}` });
//     console.info({ message: `Resource type: ${JSON.stringify(resourceType)}` });
//   },
//   { threshold: 20 },
// );

const httpServer = createServer(app);
const io = new Server(httpServer, {
  pingTimeout: 60000, //60 seconds :-  If a client doesn't send a "ping" within 60 seconds, the server will assume that the client is disconnected and close the connection.
  cors: {
    origin: process.env.CORS_ORIGIN, // only this allowed origins can connect to the Socket.IO server.
    credentials: true, //allows the client to send cookies and other credentials
  },
});
SocketConnector.initialize(io);

(async (): Promise<void> => {
  try {
    await databaseConnection();
    console.log({ message: constants.MY_SQL_CONNECTED_SUCCESSFULLY });
    const databaseInitPath = path.join(__dirname, 'helpers/childProcess/childProcessInit');
    // Fork the process to run the database initialization
    const child = fork(databaseInitPath, [], {
      execArgv: ['-r', 'ts-node/register'], // Use ts-node to run TypeScript files(-r mean require module before script)
    });
    child.send({});
  } catch (error) {
    console.log({
      message: constants.MY_SQL_UNABLE_TO_CONNECT,
      error: error,
      source: '#serverFile',
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

const port = serverConfig.PORT || constants.PORT;

// Middleware to initialize request context
app.use((req: Request, _res: Response, next: NextFunction): void => {
  req.context = new RequestContext(req);
  let locale =
    (req.headers['Accept-Language'] as string) || (req.headers['accept-language'] as string) || DEFAULT_LOCALE;
  locale = SUPPORTED_LOCALE.includes(locale) ? locale : DEFAULT_LOCALE;
  req.locale = locale;
  next();
});

//Checking server health.
app.get('/', (_req: Request, res: Response, _next: NextFunction): void => {
  res.status(httpStatusCode.OK).send({ message: constants.SERVER_WELCOME_MESSAGE });
});

//v1 api router.
app.use('/api', v1Router);

//server running on this port
const server = httpServer.listen(port, (): void => {
  console.info(`Started on port : ${port}`);
});

swagger.serveSwagger(app, '/swagger', swaggerOptions, {
  projectRoothPath: __dirname,
  routeFolderName: 'routes',
  requestModelFolderName: 'requestModels',
  responseModelFolderName: 'responseModels',
});

//middleware is commonly used to handle 404 errors for undefined routes.
app.all('*', (_req: Request, res: Response, _next: NextFunction): void => {
  res.status(httpStatusCode.NOT_FOUND).send(constants.ROUTE_NOT_FOUND);
});

// error handler middleware
app.use(function (err: CustomError, req: Request, res: Response, _next: NextFunction): void {
  const context = req.context;
  const customError = <CustomError>{
    status: err.status,
    message: err.message,
    errors: err.errors,
    stack: err.stack,
  };
  context.logError({
    message: err.errors[0].messages?.join(),
    source: req.originalUrl,
    error: customError,
    action: 'Error',
  });
  return CustomError.errorHandler(err, res);
});

module.exports = server;
