import { PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'node:crypto';
import { dynamoDb } from '../../infrastructure/dynamodb/client';
import { config } from '../../config';
import { normalizePagination, toPaginationMeta } from '../../common/repository/types';

export interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId?: string;
  actorId?: string;
  metadata?: unknown;
  createdAt: string;
}

const PREFIX = 'AUDIT_LOG#';

export class AuditLogDynamoDBRepository {
  async create(
    data: Omit<AuditLog, 'id' | 'createdAt'>,
  ): Promise<AuditLog> {
    const log: AuditLog = {
      ...data,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };

    await dynamoDb.send(new PutCommand({
      TableName: config.aws.tableName,
      Item: {
        PK: `${PREFIX}${log.id}`,
        SK: log.createdAt,
        ...log,
        GSI1PK: log.entityId
          ? `AUDIT_ENTITY#${log.entityId}`
          : undefined,
        GSI1SK: log.createdAt,
        GSI2PK: log.actorId
          ? `AUDIT_ACTOR#${log.actorId}`
          : undefined,
        GSI2SK: log.createdAt,
      },
    }));

    return log;
  }

  async findAll(options: {
    page?: number;
    limit?: number;
  } = {}) {
    const pagination = normalizePagination(options.page, options.limit);

    const result = await dynamoDb.send(new ScanCommand({
      TableName: config.aws.tableName,
      FilterExpression: 'begins_with(PK, :prefix)',
      ExpressionAttributeValues: { ':prefix': PREFIX },
    }));

    const items = (result.Items ?? []) as AuditLog[];

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
}

export const auditLogRepository =
  new AuditLogDynamoDBRepository();
