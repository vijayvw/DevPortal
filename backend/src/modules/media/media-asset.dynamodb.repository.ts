import {
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'node:crypto';
import { dynamoDb } from '../../infrastructure/dynamodb/client';
import { config } from '../../config';
import {
  normalizePagination,
  toPaginationMeta,
} from '../../common/repository/types';

export interface MediaAsset {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  folder?: string;
  uploadedById?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

const PREFIX = 'MEDIA_ASSET#';

export class MediaAssetDynamoDBRepository {
  async findById(id: string): Promise<MediaAsset | null> {
    const result = await dynamoDb.send(
      new GetCommand({
        TableName: config.aws.tableName,
        Key: {
          PK: `${PREFIX}${id}`,
          SK: 'METADATA',
        },
      }),
    );

    return (result.Item as MediaAsset | undefined) ?? null;
  }

  async findAll(options: {
    page?: number;
    limit?: number;
    folder?: string;
  } = {}) {
    const pagination = normalizePagination(
      options.page,
      options.limit,
    );

    const result = await dynamoDb.send(
      new ScanCommand({
        TableName: config.aws.tableName,
        FilterExpression: 'begins_with(PK, :prefix)',
        ExpressionAttributeValues: {
          ':prefix': PREFIX,
        },
      }),
    );

    let items = (result.Items ?? []) as MediaAsset[];

    items = items.filter((item) => !item.deletedAt);

    if (options.folder) {
      items = items.filter(
        (item) => item.folder === options.folder,
      );
    }

    items.sort((a, b) =>
      String(b.createdAt).localeCompare(
        String(a.createdAt),
      ),
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
    data: Omit<MediaAsset, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<MediaAsset> {
    const now = new Date().toISOString();

    const asset: MediaAsset = {
      ...data,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    await dynamoDb.send(
      new PutCommand({
        TableName: config.aws.tableName,
        Item: {
          PK: `${PREFIX}${asset.id}`,
          SK: 'METADATA',
          ...asset,
          GSI1PK: asset.folder
            ? `MEDIA_FOLDER#${asset.folder}`
            : undefined,
          GSI1SK: asset.createdAt,
        },
      }),
    );

    return asset;
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

export const mediaAssetRepository =
  new MediaAssetDynamoDBRepository();
