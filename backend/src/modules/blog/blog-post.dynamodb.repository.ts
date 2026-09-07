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

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category?: string;
  difficulty?: string;
  excerpt?: string;
  contentMarkdown?: string;
  tags?: string[];
  heroImageId?: string | null;
  heroImageUrl?: string | null;
  readTime?: number;
  views?: number;
  likes?: number;
  commentsCount?: number;
  featured?: boolean;
  publishStatus?: string;
  publishAt?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

const PREFIX = 'BLOGPOST#';

export class BlogPostDynamoDBRepository {
  async findById(id: string): Promise<BlogPost | null> {
    const result = await dynamoDb.send(
      new GetCommand({
        TableName: config.aws.tableName,
        Key: {
          PK: `${PREFIX}${id}`,
          SK: 'METADATA',
        },
      }),
    );

    return (result.Item as BlogPost | undefined) ?? null;
  }

  async findBySlug(slug: string): Promise<BlogPost | null> {
    const result = await dynamoDb.send(
      new ScanCommand({
        TableName: config.aws.tableName,
        FilterExpression: 'GSI2PK = :slug',
        ExpressionAttributeValues: {
          ':slug': slug,
        },
      }),
    );

    return (result.Items?.[0] as BlogPost | undefined) ?? null;
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

    let items = (result.Items ?? []) as BlogPost[];

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
        `${item.title} ${item.excerpt ?? ''}`
          .toLowerCase()
          .includes(search),
      );
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
    data: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<BlogPost> {
    const now = new Date().toISOString();

    const post: BlogPost = {
      ...data,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    await dynamoDb.send(
      new PutCommand({
        TableName: config.aws.tableName,
        Item: {
          PK: `${PREFIX}${post.id}`,
          SK: 'METADATA',
          ...post,
          GSI1PK: post.category
            ? `BLOG_CATEGORY#${post.category}`
            : undefined,
          GSI1SK: post.createdAt,
          GSI2PK: post.slug,
          GSI2SK: post.id,
        },
      }),
    );

    return post;
  }

  async update(
    id: string,
    updates: Partial<BlogPost>,
  ): Promise<BlogPost | null> {
    const current = await this.findById(id);

    if (!current) return null;

    const post: BlogPost = {
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
          ...post,
          GSI1PK: post.category
            ? `BLOG_CATEGORY#${post.category}`
            : undefined,
          GSI1SK: post.createdAt,
          GSI2PK: post.slug,
          GSI2SK: post.id,
        },
      }),
    );

    return post;
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

export const blogPostRepository =
  new BlogPostDynamoDBRepository();
