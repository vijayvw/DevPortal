import {
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';

import {
  dynamoDB,
  DYNAMODB_TABLE,
} from '../../infrastructure/dynamodb/client';

export interface SkillCategory {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  priority: number;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface SkillCategoryCreateInput {
  id?: string;
  name: string;
  slug: string;
  icon?: string | null;
  description?: string | null;
  priority?: number;
  visible?: boolean;
}

export interface SkillCategoryUpdateInput {
  name?: string;
  slug?: string;
  icon?: string | null;
  description?: string | null;
  priority?: number;
  visible?: boolean;
}

function toCategory(item: Record<string, any>): SkillCategory {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    icon: item.icon ?? null,
    description: item.description ?? null,
    priority: item.priority ?? 0,
    visible: item.visible ?? true,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    deletedAt: item.deletedAt ?? null,
  };
}

export class CategoryDynamoDBRepository {
  private pk(id: string): string {
    return `SKILL_CATEGORY#${id}`;
  }

  async findAll(): Promise<SkillCategory[]> {
    let items: Record<string, any>[] = [];
    let lastEvaluatedKey: Record<string, any> | undefined;

    do {
      const result = await dynamoDB.send(
        new ScanCommand({
          TableName: DYNAMODB_TABLE,
          FilterExpression: 'entityType = :type',
          ExpressionAttributeValues: {
            ':type': 'SKILL_CATEGORY',
          },
          ExclusiveStartKey: lastEvaluatedKey,
        }),
      );

      items.push(
        ...((result.Items ?? []) as Record<string, any>[]),
      );

      lastEvaluatedKey = result.LastEvaluatedKey;
    } while (lastEvaluatedKey);

    return items
      .map(toCategory)
      .filter((category) => !category.deletedAt)
      .sort(
        (a, b) =>
          a.priority - b.priority ||
          a.name.localeCompare(b.name),
      );
  }

  async findVisible(): Promise<SkillCategory[]> {
    const categories = await this.findAll();

    return categories.filter(
      (category) => category.visible,
    );
  }

  async findById(
    id: string,
  ): Promise<SkillCategory | null> {
    const result = await dynamoDB.send(
      new GetCommand({
        TableName: DYNAMODB_TABLE,
        Key: {
          PK: this.pk(id),
          SK: 'METADATA',
        },
      }),
    );

    if (!result.Item || result.Item.deletedAt) {
      return null;
    }

    return toCategory(result.Item);
  }

  async existsBySlug(
    slug: string,
    excludeId?: string,
  ): Promise<boolean> {
    let lastEvaluatedKey: Record<string, any> | undefined;

    do {
      const result = await dynamoDB.send(
        new ScanCommand({
          TableName: DYNAMODB_TABLE,
          FilterExpression:
            'entityType = :type AND #slug = :slug',
          ExpressionAttributeNames: {
            '#slug': 'slug',
          },
          ExpressionAttributeValues: {
            ':type': 'SKILL_CATEGORY',
            ':slug': slug,
          },
          ExclusiveStartKey: lastEvaluatedKey,
        }),
      );

      const match = (
        (result.Items ?? []) as Record<string, any>[]
      ).find(
        (item) =>
          !item.deletedAt &&
          item.id !== excludeId,
      );

      if (match) {
        return true;
      }

      lastEvaluatedKey = result.LastEvaluatedKey;
    } while (lastEvaluatedKey);

    return false;
  }

  async create(
    data: SkillCategoryCreateInput,
  ): Promise<SkillCategory> {
    const now = new Date().toISOString();
    const priority = data.priority ?? 0;

    const item = {
      PK: this.pk(data.id ?? data.slug),
      SK: 'METADATA',
      entityType: 'SKILL_CATEGORY',

      id: data.id ?? data.slug,
      name: data.name,
      slug: data.slug,
      icon: data.icon ?? null,
      description: data.description ?? null,
      priority,
      visible: data.visible ?? true,

      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };

    await dynamoDB.send(
      new PutCommand({
        TableName: DYNAMODB_TABLE,
        Item: item,
      }),
    );

    return toCategory(item);
  }

  async update(
    id: string,
    data: SkillCategoryUpdateInput,
  ): Promise<SkillCategory> {
    const existing = await this.findById(id);

    if (!existing) {
      throw new Error('Skill category not found');
    }

    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    const item = {
      PK: this.pk(id),
      SK: 'METADATA',
      entityType: 'SKILL_CATEGORY',
      ...updated,
    };

    await dynamoDB.send(
      new PutCommand({
        TableName: DYNAMODB_TABLE,
        Item: item,
      }),
    );

    return toCategory(item);
  }

  async softDelete(
    id: string,
  ): Promise<SkillCategory> {
    const existing = await this.findById(id);

    if (!existing) {
      throw new Error('Skill category not found');
    }

    const now = new Date().toISOString();

    await dynamoDB.send(
      new UpdateCommand({
        TableName: DYNAMODB_TABLE,
        Key: {
          PK: this.pk(id),
          SK: 'METADATA',
        },
        UpdateExpression:
          'SET deletedAt = :deletedAt, updatedAt = :updatedAt',
        ExpressionAttributeValues: {
          ':deletedAt': now,
          ':updatedAt': now,
        },
      }),
    );

    return {
      ...existing,
      deletedAt: now,
      updatedAt: now,
    };
  }
}

export const categoryDynamoDBRepository =
  new CategoryDynamoDBRepository();

export const skillCategoryRepository =
  categoryDynamoDBRepository;
