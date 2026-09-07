import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDb } from '../../infrastructure/dynamodb/client';
import { config } from '../../config';

export interface SiteSettings {
  portfolioTitle?: string;
  tagline?: string;
  email?: string;
  phone?: string;
  github?: string;
  linkedin?: string;
  resumeUrl?: string;
}

const PK = 'SETTINGS';
const SK = 'SITE';

export class SettingsDynamoDBRepository {
  async get(): Promise<SiteSettings | null> {
    const result = await dynamoDb.send(new GetCommand({
      TableName: config.aws.tableName,
      Key: { PK, SK },
    }));

    return (result.Item as SiteSettings | undefined) ?? null;
  }

  async save(data: SiteSettings): Promise<SiteSettings> {
    await dynamoDb.send(new PutCommand({
      TableName: config.aws.tableName,
      Item: {
        PK,
        SK,
        ...data,
        updatedAt: new Date().toISOString(),
      },
    }));

    return data;
  }
}

export const settingsRepository =
  new SettingsDynamoDBRepository();
