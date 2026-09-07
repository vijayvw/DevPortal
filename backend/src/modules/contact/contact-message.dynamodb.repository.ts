import { GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'node:crypto';
import { dynamoDb } from '../../infrastructure/dynamodb/client';
import { config } from '../../config';
import { normalizePagination, toPaginationMeta } from '../../common/repository/types';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  repliedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

const PREFIX = 'CONTACT_MESSAGE#';

export class ContactMessageDynamoDBRepository {
  async findById(id: string): Promise<ContactMessage | null> {
    const result = await dynamoDb.send(new GetCommand({
      TableName: config.aws.tableName,
      Key: { PK: `${PREFIX}${id}`, SK: 'METADATA' },
    }));

    return (result.Item as ContactMessage | undefined) ?? null;
  }

  async findAll(options: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}) {
    const pagination = normalizePagination(options.page, options.limit);

    const result = await dynamoDb.send(new ScanCommand({
      TableName: config.aws.tableName,
      FilterExpression: 'begins_with(PK, :prefix)',
      ExpressionAttributeValues: { ':prefix': PREFIX },
    }));

    let items = (result.Items ?? []) as ContactMessage[];

    if (options.status) {
      items = items.filter(item => item.status === options.status);
    }

    items.sort((a, b) =>
      String(b.createdAt).localeCompare(String(a.createdAt)),
    );

    const total = items.length;

    return {
      items: items.slice(
        pagination.skip,
        pagination.skip + pagination.limit,
      ),
      meta: toPaginationMeta(
        pagination.page,
        pagination.limit,
        total,
      ),
    };
  }

  async create(
    data: Omit<ContactMessage, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ContactMessage> {
    const now = new Date().toISOString();

    const message: ContactMessage = {
      ...data,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    await dynamoDb.send(new PutCommand({
      TableName: config.aws.tableName,
      Item: {
        PK: `${PREFIX}${message.id}`,
        SK: 'METADATA',
        ...message,
      },
    }));

    return message;
  }

  async update(
    id: string,
    updates: Partial<ContactMessage>,
  ): Promise<ContactMessage | null> {
    const current = await this.findById(id);

    if (!current) return null;

    const message: ContactMessage = {
      ...current,
      ...updates,
      id: current.id,
      createdAt: current.createdAt,
      updatedAt: new Date().toISOString(),
    };

    await dynamoDb.send(new PutCommand({
      TableName: config.aws.tableName,
      Item: {
        PK: `${PREFIX}${id}`,
        SK: 'METADATA',
        ...message,
      },
    }));

    return message;
  }
}

export const contactMessageRepository =
  new ContactMessageDynamoDBRepository();
