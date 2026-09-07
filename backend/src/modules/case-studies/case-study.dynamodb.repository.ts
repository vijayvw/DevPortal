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

export interface CaseStudy {
  id: string;
  projectId?: string | null;
  title: string;
  subtitle?: string;
  category?: string;
  featured?: boolean;
  timelineStart?: string | null;
  timelineEnd?: string | null;
  duration?: string;
  challenge?: string;
  solution?: string;
  impact?: string;
  technologies?: string[];
  impactMetrics?: unknown[];
  architectureComponents?: unknown[];
  pattern?: string;
  publishStatus?: string;
  createdAt: string;
  updatedAt: string;
}

const PREFIX = 'CASESTUDY#';

export class CaseStudyDynamoDBRepository {
  async findById(id: string): Promise<CaseStudy | null> {
    const result = await dynamoDb.send(
      new GetCommand({
        TableName: config.aws.tableName,
        Key: {
          PK: `${PREFIX}${id}`,
          SK: 'METADATA',
        },
      }),
    );

    return (result.Item as CaseStudy | undefined) ?? null;
  }

  async findAll(options: {
    page?: number;
    limit?: number;
    publicOnly?: boolean;
    category?: string;
    featured?: boolean;
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

    let items = (result.Items ?? []) as CaseStudy[];

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

    if (options.featured !== undefined) {
      items = items.filter(
        (item) => item.featured === options.featured,
      );
    }

    if (options.search) {
      const term = options.search.toLowerCase();

      items = items.filter((item) =>
        `${item.title} ${item.subtitle ?? ''} ${
          item.challenge ?? ''
        } ${item.solution ?? ''}`
          .toLowerCase()
          .includes(term),
      );
    }

    items.sort((a, b) => {
      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1;
      }

      return String(b.createdAt).localeCompare(
        String(a.createdAt),
      );
    });

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
    data: Omit<CaseStudy, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<CaseStudy> {
    const now = new Date().toISOString();

    const caseStudy: CaseStudy = {
      ...data,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    await dynamoDb.send(
      new PutCommand({
        TableName: config.aws.tableName,
        Item: {
          PK: `${PREFIX}${caseStudy.id}`,
          SK: 'METADATA',
          ...caseStudy,
          GSI1PK: caseStudy.category
            ? `CASESTUDY_CATEGORY#${caseStudy.category}`
            : undefined,
          GSI1SK: caseStudy.createdAt,
          GSI2PK:
            caseStudy.publishStatus === 'PUBLISHED'
              ? 'CASESTUDIES#PUBLISHED'
              : `CASESTUDIES#${caseStudy.publishStatus ?? 'DRAFT'}`,
          GSI2SK: caseStudy.createdAt,
        },
      }),
    );

    return caseStudy;
  }

  async update(
    id: string,
    updates: Partial<CaseStudy>,
  ): Promise<CaseStudy | null> {
    const current = await this.findById(id);

    if (!current) return null;

    const caseStudy: CaseStudy = {
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
          ...caseStudy,
          GSI1PK: caseStudy.category
            ? `CASESTUDY_CATEGORY#${caseStudy.category}`
            : undefined,
          GSI1SK: caseStudy.createdAt,
          GSI2PK:
            caseStudy.publishStatus === 'PUBLISHED'
              ? 'CASESTUDIES#PUBLISHED'
              : `CASESTUDIES#${caseStudy.publishStatus ?? 'DRAFT'}`,
          GSI2SK: caseStudy.createdAt,
        },
      }),
    );

    return caseStudy;
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

export const caseStudyRepository =
  new CaseStudyDynamoDBRepository();
