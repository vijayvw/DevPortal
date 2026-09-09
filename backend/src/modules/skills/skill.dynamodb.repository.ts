import {
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';

import {
  dynamoDB,
  DYNAMODB_TABLE,
} from '../../infrastructure/dynamodb/client';

export interface Skill {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  iconUrl: string | null;
  proficiency: number;
  yearsExperience: number | null;
  priority: number;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface SkillCreateInput {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  iconUrl?: string | null;
  proficiency: number;
  yearsExperience?: number | null;
  priority?: number;
  visible?: boolean;
}

export interface SkillUpdateInput {
  name?: string;
  category?: string;
  categoryId?: string;
  iconUrl?: string | null;
  proficiency?: number;
  yearsExperience?: number | null;
  priority?: number;
  visible?: boolean;
}

export interface SkillFilters {
  category?: string;
  visibleOnly?: boolean;
  search?: string;
}

function toSkill(item: Record<string, any>): Skill {
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    categoryId: item.categoryId ?? item.category,
    iconUrl: item.iconUrl ?? null,
    proficiency: item.proficiency ?? 0,
    yearsExperience: item.yearsExperience ?? null,
    priority: item.priority ?? 0,
    visible: item.visible ?? true,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    deletedAt: item.deletedAt ?? null,
  };
}

export class SkillDynamoDBRepository {
  private pk(id: string): string {
    return `SKILL#${id}`;
  }

  async findAll(
    filters?: SkillFilters,
    sort: 'priority' | 'name' | 'proficiency' = 'priority',
  ): Promise<Skill[]> {
    let items: Record<string, any>[] = [];

    if (filters?.category) {
      let lastEvaluatedKey: Record<string, any> | undefined;

      do {
        const result = await dynamoDB.send(
          new QueryCommand({
            TableName: DYNAMODB_TABLE,
            IndexName: 'GSI1',
            KeyConditionExpression: 'GSI1PK = :pk',
            ExpressionAttributeValues: {
              ':pk': `SKILLS#${filters.category}`,
            },
            ExclusiveStartKey: lastEvaluatedKey,
          }),
        );

        items.push(...((result.Items ?? []) as Record<string, any>[]));
        lastEvaluatedKey = result.LastEvaluatedKey;
      } while (lastEvaluatedKey);
    } else {
      let lastEvaluatedKey: Record<string, any> | undefined;

      do {
        const result = await dynamoDB.send(
          new ScanCommand({
            TableName: DYNAMODB_TABLE,
            FilterExpression: 'entityType = :type',
            ExpressionAttributeValues: {
              ':type': 'SKILL',
            },
            ExclusiveStartKey: lastEvaluatedKey,
          }),
        );

        items.push(...((result.Items ?? []) as Record<string, any>[]));
        lastEvaluatedKey = result.LastEvaluatedKey;
      } while (lastEvaluatedKey);
    }

    let skills = items
      .filter((item) => item.entityType === 'SKILL')
      .map(toSkill)
      .filter((skill) => !skill.deletedAt);

    if (filters?.visibleOnly) {
      skills = skills.filter(
        (skill) => skill.visible === true,
      );
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase();

      skills = skills.filter(
        (skill) =>
          skill.name.toLowerCase().includes(search) ||
          skill.category.toLowerCase().includes(search),
      );
    }

    switch (sort) {
      case 'name':
        skills.sort((a, b) =>
          a.name.localeCompare(b.name),
        );
        break;

      case 'proficiency':
        skills.sort(
          (a, b) => b.proficiency - a.proficiency,
        );
        break;

      case 'priority':
      default:
        skills.sort(
          (a, b) =>
            a.category.localeCompare(b.category) ||
            a.priority - b.priority ||
            a.name.localeCompare(b.name),
        );
        break;
    }

    return skills;
  }

  async findById(id: string): Promise<Skill | null> {
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

    return toSkill(result.Item);
  }

  async findByIdForAdmin(
    id: string,
  ): Promise<Skill | null> {
    const result = await dynamoDB.send(
      new GetCommand({
        TableName: DYNAMODB_TABLE,
        Key: {
          PK: this.pk(id),
          SK: 'METADATA',
        },
      }),
    );

    if (!result.Item) {
      return null;
    }

    return toSkill(result.Item);
  }

  async existsByName(
    name: string,
    excludeId?: string,
  ): Promise<boolean> {
    let lastEvaluatedKey: Record<string, any> | undefined;

    do {
      const result = await dynamoDB.send(
        new ScanCommand({
          TableName: DYNAMODB_TABLE,
          FilterExpression:
            'entityType = :type AND #name = :name',
          ExpressionAttributeNames: {
            '#name': 'name',
          },
          ExpressionAttributeValues: {
            ':type': 'SKILL',
            ':name': name,
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

  async create(data: SkillCreateInput): Promise<Skill> {
    const now = new Date().toISOString();
    const priority = data.priority ?? 0;

    const item = {
      PK: this.pk(data.id),
      SK: 'METADATA',
      GSI1PK: `SKILLS#${data.category}`,
      GSI1SK: `${String(priority).padStart(6, '0')}#${data.id}`,
      entityType: 'SKILL',

      id: data.id,
      name: data.name,
      category: data.category,
      categoryId: data.categoryId,
      iconUrl: data.iconUrl ?? null,
      proficiency: data.proficiency,
      yearsExperience: data.yearsExperience ?? null,
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

    return toSkill(item);
  }

  async update(
    id: string,
    data: SkillUpdateInput,
  ): Promise<Skill> {
    const existing =
      await this.findByIdForAdmin(id);

    if (!existing) {
      throw new Error('Skill not found');
    }

    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    const item = {
      PK: this.pk(id),
      SK: 'METADATA',
      GSI1PK: `SKILLS#${updated.category}`,
      GSI1SK:
        `${String(updated.priority).padStart(6, '0')}#${id}`,
      entityType: 'SKILL',
      ...updated,
    };

    await dynamoDB.send(
      new PutCommand({
        TableName: DYNAMODB_TABLE,
        Item: item,
      }),
    );

    return updated;
  }

  async softDelete(id: string): Promise<Skill> {
    const existing =
      await this.findByIdForAdmin(id);

    if (!existing) {
      throw new Error('Skill not found');
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

export const skillDynamoDBRepository =
  new SkillDynamoDBRepository();

export const skillRepository =
  skillDynamoDBRepository;
