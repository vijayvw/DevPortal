import swaggerJSDoc from 'swagger-jsdoc';
import { config } from '../config';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',

    info: {
      title: 'DevPortal API',
      version: '1.0.0',
      description:
        'DevPortal backend API documentation',
    },

    servers: [
      {
        url: `http://localhost:${config.server.port}${config.server.apiPrefix}`,
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },

  apis: [
    'src/modules/**/*.routes.ts',
  ],
};

export const swaggerSpec =
  swaggerJSDoc(options);
