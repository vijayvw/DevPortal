import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { dynamoDb } from '../../infrastructure/dynamodb/client';
import { config } from '../../config';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

const PK_PREFIX = 'USER#';
const METADATA = 'METADATA';

export class UserDynamoDBRepository {
  async findById(id: string): Promise<User | null> {
    const result = await dynamoDb.send(
      new GetCommand({
        TableName: config.aws.tableName,
        Key: {
          PK: `${PK_PREFIX}${id}`,
          SK: METADATA,
        },
      }),
    );

    return (result.Item as User | undefined) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await dynamoDb.send(
      new QueryCommand({
        TableName: config.aws.tableName,
        IndexName: 'GSI1',
        KeyConditionExpression: 'GSI1PK = :pk',
        ExpressionAttributeValues: {
          ':pk': email.toLowerCase(),
        },
        Limit: 1,
      }),
    );

    return (result.Items?.[0] as User | undefined) ?? null;
  }

  async create(user: User): Promise<User> {
    await dynamoDb.send(
      new PutCommand({
        TableName: config.aws.tableName,
        Item: {
          PK: `${PK_PREFIX}${user.id}`,
          SK: METADATA,
          ...user,
          GSI1PK: user.email.toLowerCase(),
          GSI1SK: `${PK_PREFIX}${user.id}`,
        },
        ConditionExpression: 'attribute_not_exists(PK)',
      }),
    );

    return user;
  }

  async update(
    id: string,
    updates: Partial<User>,
  ): Promise<User | null> {
    const entries = Object.entries(updates).filter(
      ([, value]) => value !== undefined,
    );

    if (entries.length === 0) {
      return this.findById(id);
    }

    const names: Record<string, string> = {};
    const values: Record<string, unknown> = {};
    const expressions: string[] = [];

    entries.forEach(([key, value], index) => {
      const name = `#f${index}`;
      const val = `:v${index}`;

      names[name] = key;
      values[val] = value;
      expressions.push(`${name} = ${val}`);
    });

    expressions.push('#updatedAt = :updatedAt');
    names['#updatedAt'] = 'updatedAt';
    values[':updatedAt'] = new Date().toISOString();

    if (updates.email) {
      expressions.push('#gsi1pk = :email');
      names['#gsi1pk'] = 'GSI1PK';
      values[':email'] = updates.email.toLowerCase();
    }

    const result = await dynamoDb.send(
      new UpdateCommand({
        TableName: config.aws.tableName,
        Key: {
          PK: `${PK_PREFIX}${id}`,
          SK: METADATA,
        },
        UpdateExpression: `SET ${expressions.join(', ')}`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ReturnValues: 'ALL_NEW',
      }),
    );

    return (result.Attributes as User | undefined) ?? null;
  }

  async softDelete(id: string): Promise<void> {
    const deletedAt = new Date().toISOString();

    await dynamoDb.send(
      new UpdateCommand({
        TableName: config.aws.tableName,
        Key: {
          PK: `${PK_PREFIX}${id}`,
          SK: METADATA,
        },
        UpdateExpression:
          'SET #deletedAt = :deletedAt, #updatedAt = :updatedAt',
        ExpressionAttributeNames: {
          '#deletedAt': 'deletedAt',
          '#updatedAt': 'updatedAt',
        },
        ExpressionAttributeValues: {
          ':deletedAt': deletedAt,
          ':updatedAt': deletedAt,
        },
      }),
    );
  }
}

export const userRepository = new UserDynamoDBRepository();
