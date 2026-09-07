import {
  DeleteCommand,
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

export interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  status?: string;
  difficulty?: string;
  category?: string;
  tags?: string[];
  githubUrl?: string;
  liveUrl?: string;
  videoUrl?: string;
  dockerUrl?: string;
  terraformUrl?: string;
  helmUrl?: string;
  kubernetesUrl?: string;
  lessons?: string[];
  challenges?: string[];
  solutions?: string[];
  futureImprovements?: string[];
  pinned?: boolean;
  featured?: boolean;
  publishStatus?: string;
  publishAt?: string | null;
  coverImageId?: string | null;
  architectureImageId?: string | null;
  galleryImageIds?: string[];
  caseStudyIds?: string[];
  views?: number;
  likes?: number;
  createdAt: string;
  updatedAt: string;
}

const PREFIX = 'PROJECT#';

export class ProjectDynamoDBRepository {
  async findById(id: string): Promise<Project | null> {
    const result = await dynamoDb.send(
      new GetCommand({
        TableName: config.aws.tableName,
        Key: {
          PK: `${PREFIX}${id}`,
          SK: 'METADATA',
        },
      }),
    );

    return (result.Item as Project | undefined) ?? null;
  }

  async findBySlug(slug: string): Promise<Project | null> {
    const result = await dynamoDb.send(
      new ScanCommand({
        TableName: config.aws.tableName,
        FilterExpression: 'GSI2PK = :slug',
        ExpressionAttributeValues: {
          ':slug': slug,
        },
      }),
    );

    return (result.Items?.[0] as Project | undefined) ?? null;
  }

  async findAll(options: {
    page?: number;
    limit?: number;
    publicOnly?: boolean;
    category?: string;
    search?: string;
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

    let items = (result.Items ?? []) as Project[];

    if (options.publicOnly) {
      items = items.filter(
        (item) => item.publishStatus === 'PUBLISHED',
      );
    }

    if (options.category) {
      items = items.filter(
        (item) => item.category === options.category,
      );
    }

    if (options.search) {
      const search = options.search.toLowerCase();

      items = items.filter((item) =>
        `${item.title} ${item.shortDescription ?? ''} ${
          item.description ?? ''
        }`
          .toLowerCase()
          .includes(search),
      );
    }

    items.sort((a, b) =>
      String(b.createdAt).localeCompare(String(a.createdAt)),
    );

    const total = items.length;
    const paginated = items.slice(
      pagination.skip,
      pagination.skip + pagination.limit,
    );

    return {
      items: paginated,
      meta: toPaginationMeta(
        pagination.page,
        pagination.limit,
        total,
      ),
    };
  }

  async create(
    data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Project> {
    const now = new Date().toISOString();

    const project: Project = {
      ...data,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    await dynamoDb.send(
      new PutCommand({
        TableName: config.aws.tableName,
        Item: {
          PK: `${PREFIX}${project.id}`,
          SK: 'METADATA',
          ...project,
          GSI1PK: project.category
            ? `PROJECT_CATEGORY#${project.category}`
            : undefined,
          GSI1SK: project.createdAt,
          GSI2PK: project.slug,
          GSI2SK: project.id,
        },
        ConditionExpression: 'attribute_not_exists(PK)',
      }),
    );

    return project;
  }

  async update(
    id: string,
    updates: Partial<Project>,
  ): Promise<Project | null> {
    const current = await this.findById(id);

    if (!current) return null;

    const next: Project = {
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
          ...next,
          GSI1PK: next.category
            ? `PROJECT_CATEGORY#${next.category}`
            : undefined,
          GSI1SK: next.createdAt,
          GSI2PK: next.slug,
          GSI2SK: next.id,
        },
      }),
    );

    return next;
  }

  async softDelete(id: string): Promise<void> {
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
          ':deletedAt': new Date().toISOString(),
          ':updatedAt': new Date().toISOString(),
        },
      }),
    );
  }

  async incrementViews(id: string): Promise<void> {
    await dynamoDb.send(
      new UpdateCommand({
        TableName: config.aws.tableName,
        Key: {
          PK: `${PREFIX}${id}`,
          SK: 'METADATA',
        },
        UpdateExpression:
          'SET #views = if_not_exists(#views, :zero) + :one',
        ExpressionAttributeNames: {
          '#views': 'views',
        },
        ExpressionAttributeValues: {
          ':zero': 0,
          ':one': 1,
        },
      }),
    );
  }

  async incrementLikes(id: string): Promise<void> {
    await dynamoDb.send(
      new UpdateCommand({
        TableName: config.aws.tableName,
        Key: {
          PK: `${PREFIX}${id}`,
          SK: 'METADATA',
        },
        UpdateExpression:
          'SET #likes = if_not_exists(#likes, :zero) + :one',
        ExpressionAttributeNames: {
          '#likes': 'likes',
        },
        ExpressionAttributeValues: {
          ':zero': 0,
          ':one': 1,
        },
      }),
    );
  }

  async decrementLikes(id: string): Promise<void> {
    await dynamoDb.send(
      new UpdateCommand({
        TableName: config.aws.tableName,
        Key: {
          PK: `${PREFIX}${id}`,
          SK: 'METADATA',
        },
        UpdateExpression:
          'SET #likes = if_not_exists(#likes, :zero) - :one',
        ExpressionAttributeNames: {
          '#likes': 'likes',
        },
        ExpressionAttributeValues: {
          ':zero': 0,
          ':one': 1,
        },
      }),
    );
  }
}

export const projectRepository =
  new ProjectDynamoDBRepository();
