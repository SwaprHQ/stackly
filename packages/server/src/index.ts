import { config } from 'dotenv';
import { getEnv, getRequiredEnv } from './utils/env';

const production = getEnv('NODE_ENV') === 'production';
if (!production) {
  config();
}

import { HandlerDecorations, Server } from '@hapi/hapi';
import chalk from 'chalk';
import Mongoose from 'mongoose';
import Joi from 'joi';
import * as inert from '@hapi/inert';
import * as vision from '@hapi/vision';
import hapiSwagger, { RegisterOptions } from 'hapi-swagger';
import { join } from 'path';
import {
  handleCreateOrder,
  createOrderRequestDTO,
} from './controllers/createOrder';
import { startAgenda } from './agenda/agenda';
import {
  handleGetVaultOrders,
  createOrderRequestDTO as getVaultOrdersRequestDTO,
} from './controllers/getVaultOrders';

const mongoUri = getRequiredEnv('MONGO_URI');
const mongoDebug = getEnv('MONGO_DEBUG') === 'true';
const serverPort = getRequiredEnv('SERVER_PORT');

const main = async () => {
  Mongoose.connection.on('error', (error) => {
    console.error(error);
    process.exit(100);
  });
  await Mongoose.connect(mongoUri, {});
  Mongoose.set('debug', mongoDebug);

  // await startAgenda();

  const server = new Server({
    host: 'localhost',
    port: serverPort,
    routes: {
      auth: false,
      cors: {
        origin: ['*'],
      },
    },
    debug: {
      request: ['*'],
      log: ['*'],
    },
  });

  await server.validator(Joi);

  server.route([
    {
      method: 'POST',
      path: '/orders',
      options: {
        handler: handleCreateOrder as HandlerDecorations,
        description: 'Creates a new order',
        notes: 'Creates a new order',
        tags: ['api'],
        validate: {
          payload: createOrderRequestDTO,
          failAction: (request, h, err) => {
            throw err;
          },
        },
      },
    },
    {
      method: 'GET',
      path: '/orders',
      options: {
        handler: handleGetVaultOrders as HandlerDecorations,
        description: 'Gets vault orders',
        tags: ['api'],
        validate: {
          query: getVaultOrdersRequestDTO,
          failAction: (request, h, err) => {
            throw err;
          },
        },
      },
    },
  ]);

  const swaggerBasePathProd = production ? join('/') : '/';

  const swaggerOptions: RegisterOptions = {
    info: {
      title: 'API Documentation',
    },
    debug: true,
    deReference: true,
    documentationPath: join(swaggerBasePathProd, '/docs'),
    swaggerUIPath: join(swaggerBasePathProd, '/swaggerui/'),
    jsonPath: join(swaggerBasePathProd, '/swagger.json'),
    basePath: join(swaggerBasePathProd, '/'),
  };

  // await findAndProcessDCAOrders();

  await server.register([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { plugin: inert } as any,
    { plugin: vision },
    { plugin: hapiSwagger, options: swaggerOptions },
  ]);
  await server.start();

  console.log(chalk.greenBright(`Server is listening on port ${serverPort}`));
};

main().catch(console.error);
