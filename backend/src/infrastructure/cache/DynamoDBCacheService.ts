import {
  DeleteCommand,
  GetCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';
import { dynamoDb } from '../dynamodb/client';
import { config } from '../../config';
import type { CacheService } from './CacheService.interface';

const AUTH_REFRESH_PREFIX = 'AUTH_REFRESH#';
const TOKEN_PREFIX = 'TOKEN';

export class DynamoDBCacheService implements CacheService {
  async get<T = unknown>(key: string): Promise<T | null> {
    const result = await dynamoDb.send(
      new GetCommand({
        TableName: config.aws.tableName,
        Key: {
          PK: key,
          SK: TOKEN_PREFIX,
        },
      }),
    );

    if (!result.Item) {
      return null;
    }

    if (
      typeof result.Item.expiresAt === 'number' &&
      result.Item.expiresAt <= Math.floor(Date.now() / 1000)
    ) {
      await this.del(key);
      return null;
    }

    return (result.Item.value as T) ?? null;
  }

  async set<T = unknown>(
    key: string,
    value: T,
    ttlSeconds?: number,
  ): Promise<void> {
    const item: Record<string, unknown> = {
      PK: key,
      SK: TOKEN_PREFIX,
      value,
    };

    if (ttlSeconds) {
      item.expiresAt =
        Math.floor(Date.now() / 1000) + ttlSeconds;
    }

    await dynamoDb.send(
      new PutCommand({
        TableName: config.aws.tableName,
        Item: item,
      }),
    );
  }

  async del(key: string): Promise<void> {
    await dynamoDb.send(
      new DeleteCommand({
        TableName: config.aws.tableName,
        Key: {
          PK: key,
          SK: TOKEN_PREFIX,
        },
      }),
    );
  }

  async ping(): Promise<boolean> {
    const key = `${AUTH_REFRESH_PREFIX}HEALTH`;

    try {
      await this.set(key, { ok: true }, 30);
      await this.del(key);
      return true;
    } catch {
      return false;
    }
  }
}

export const cacheService = new DynamoDBCacheService();
