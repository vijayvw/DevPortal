import {
  PutCommand,
  ScanCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'node:crypto';
import { dynamoDb } from '../../infrastructure/dynamodb/client';
import { config } from '../../config';

export interface Technology {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

const PREFIX = 'TECHNOLOGY#';

export class TechnologyDynamoDBRepository {
  async findById(id: string): Promise<Technology | null> {
    const result = await dynamoDb.send(
      new ScanCommand({
        TableName: config.aws.tableName,
        FilterExpression: 'PK = :pk',
        ExpressionAttributeValues: {
          ':pk': `${PREFIX}${id}`,
        },
      }),
    );

    return (result.Items?.[0] as Technology | undefined) ?? null;
  }

  async findAll(): Promise<Technology[]> {
    const result = await dynamoDb.send(
      new ScanCommand({
        TableName: config.aws.tableName,
        FilterExpression: 'begins_with(PK, :prefix)',
        ExpressionAttributeValues: {
          ':prefix': PREFIX,
        },
      }),
    );

    return (result.Items ?? []) as Technology[];
  }

  async create(
    data: Omit<Technology, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Technology> {
    const now = new Date().toISOString();

    const technology: Technology = {
      ...data,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    await dynamoDb.send(
      new PutCommand({
        TableName: config.aws.tableName,
        Item: {
          PK: `${PREFIX}${technology.id}`,
          SK: 'METADATA',
          ...technology,
          GSI1PK: `TECHNOLOGY_SLUG#${technology.slug}`,
          GSI1SK: technology.id,
        },
      }),
    );

    return technology;
  }

  async update(
    id: string,
    updates: Partial<Technology>,
  ): Promise<Technology | null> {
    const current = await this.findById(id);

    if (!current) return null;

    const technology: Technology = {
      ...current,
      ...updates,
      id: current.id,
      createdAt: current.createdAt,
      updatedAt: new Date().toISOString(),
    };

    await dynamoDb.send(
      new PutCommand({
        TableName: config.aws.tableName,
        Item: {
          PK: `${PREFIX}${id}`,
          SK: 'METADATA',
          ...technology,
          GSI1PK: `TECHNOLOGY_SLUG#${technology.slug}`,
          GSI1SK: technology.id,
        },
      }),
    );

    return technology;
  }

  async softDelete(id: string): Promise<void> {
    const now = new Date().toISOString();

    await dynamoDb.send(
      new UpdateCommand({
        TableName: config.aws.tableName,
        Key: {
          PK: `${PREFIX}${id}`,
          SK: 'METADATA',
        },
        UpdateExpression:
          'SET #deletedAt = :deletedAt, #updatedAt = :updatedAt',
        ExpressionAttributeNames: {
          '#deletedAt': 'deletedAt',
          '#updatedAt': 'updatedAt',
        },
        ExpressionAttributeValues: {
          ':deletedAt': now,
          ':updatedAt': now,
        },
      }),
    );
  }
}

export const technologyRepository =
  new TechnologyDynamoDBRepository();
