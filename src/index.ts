import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import httpStatusCode from 'http-status-codes';
import swagger from 'express-joi-swagger-spec';
// import blockedAt from 'blocked-at';

import RequestContext from './helpers/context';
import { DEFAULT_LOCALE, isProduction, serverConfig, SUPPORTED_LOCALE } from './config';
import EmailService from './utils/email';
import { AppDataSource } from './database/mysql/typeormConfig';
import constants from './constants';
import CustomError from './shared/errorHandler/customError';
import SocketConnector from './socket/socketConnector';
import processRoleSeeder from './seeders/roleSeeder';
import v1Router from './routes/v1';

const app = express();

if (!isProduction) {
  EmailService.loadTestAccount();
}

app.use(cors());
//facing issue - Content-Security-Policy that why i am hiding the helmet yet
// app.use(helmet());

// request payload middleware
app.use(express.json());
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
  pingTimeout: 60000,
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});
SocketConnector.initialize(io);

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

const port = serverConfig.port || constants.PORT;

// Middleware to initialize request context
app.use((req: Request, _res: Response, next: NextFunction) => {
  req.context = new RequestContext(req);
  let locale =
    (req.headers['Accept-Language'] as string) || (req.headers['accept-language'] as string) || DEFAULT_LOCALE;
  locale = SUPPORTED_LOCALE.includes(locale) ? locale : DEFAULT_LOCALE;
  req.locale = locale;
  next();
});

//Checking server health.
app.get('/', (_req: Request, res: Response, _next: NextFunction) => {
  res.status(httpStatusCode.OK).send({ message: constants.SERVER_WELCOME_MESSAGE });
});

//v1 api router.
app.use('/api', v1Router);

const server = httpServer.listen(port, () => {
  console.info(`Started on port : ${port}`);
});

swagger.serveSwagger(app, '/swagger', swaggerOptions, {
  projectRoothPath: __dirname,
  routeFolderName: 'routes',
  requestModelFolderName: 'requestModels',
  responseModelFolderName: 'responseModels',
});

app.all('*', (_req: Request, res: Response, _next: NextFunction) => {
  res.status(httpStatusCode.NOT_FOUND).send(constants.ROUTE_NOT_FOUND);
});

// error handler middleware
app.use(function (err: CustomError, req: Request, res: Response, _next: NextFunction) {
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
