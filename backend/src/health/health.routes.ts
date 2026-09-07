import { Router } from 'express';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { ApiResponse } from '../common/responses/ApiResponse';
import {
  dynamoDB,
  DYNAMODB_TABLE,
} from '../infrastructure/dynamodb/client';
import { cacheService } from '../infrastructure/cache/DynamoDBCacheService';

export const healthRouter = Router();

healthRouter.get(
  '/health',
  (_req, res) => {
    ApiResponse.success(res, {
      status: 'ok',
      uptimeSeconds: Math.round(
        process.uptime(),
      ),
      timestamp:
        new Date().toISOString(),
    });
  },
);

healthRouter.get(
  '/ready',
  async (_req, res) => {
    const [
      dynamodbUp,
      cacheUp,
    ] = await Promise.all([
      checkDynamoDB(),
      cacheService.ping(),
    ]);

    const checks = {
      dynamodb: dynamodbUp
        ? 'up'
        : 'down',

      cache: cacheUp
        ? 'up'
        : 'down',
    };

    if (
      dynamodbUp &&
      cacheUp
    ) {
      ApiResponse.success(res, {
        status: 'ready',
        checks,
      });

      return;
    }

    ApiResponse.error(
      res,
      'One or more dependencies are unavailable',
      503,
      undefined,
      {
        status: 'not_ready',
        checks,
      },
    );
  },
);

healthRouter.get(
  '/live',
  (_req, res) => {
    ApiResponse.success(res, {
      status: 'alive',
    });
  },
);

async function checkDynamoDB(): Promise<boolean> {
  try {
    await dynamoDB.send(
      new GetCommand({
        TableName: DYNAMODB_TABLE,
        Key: {
          PK: '__HEALTH_CHECK__',
          SK: '__HEALTH_CHECK__',
        },
      }),
    );

    return true;
  } catch {
    return false;
  }
}
