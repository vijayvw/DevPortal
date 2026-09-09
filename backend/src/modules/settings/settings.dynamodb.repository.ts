import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDb } from '../../infrastructure/dynamodb/client';
import { config } from '../../config';

export interface SiteSettings {
  id?: string;
  portfolioTitle?: string;
  tagline?: string;
  shortDescription?: string;
  yearsExperience?: string;
  cloudPlatforms?: string;
  technologies?: string;
  aboutGreeting?: string;
  aboutParagraphs?: string[];
  aboutQuote?: string;
  aboutGoal?: string;
  specializations?: string[];
  timelineTitle?: string;
  timelineSubtitle?: string;
  timeline?: Array<{
    year: string;
    title: string;
    organization?: string;
    description: string;
    icon?: string;
  }>;
  email?: string;
  phone?: string;
  address?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  resumeUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

const PK = 'SETTINGS';
const SK = 'SITE';

export class SettingsDynamoDBRepository {
  async get(): Promise<SiteSettings | null> {
    const result = await dynamoDb.send(
      new GetCommand({
        TableName: config.aws.tableName,
        Key: {
          PK,
          SK,
        },
      }),
    );

    if (!result.Item) {
      return null;
    }

    return result.Item as SiteSettings;
  }

  async save(
    data: SiteSettings,
  ): Promise<SiteSettings> {
    const existing = await this.get();
    const now = new Date().toISOString();

    const item: SiteSettings = {
      ...existing,
      ...data,
      id: 'site-settings',
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    await dynamoDb.send(
      new PutCommand({
        TableName: config.aws.tableName,
        Item: {
          PK,
          SK,
          ...item,
        },
      }),
    );

    return item;
  }
}

export const settingsRepository =
  new SettingsDynamoDBRepository();
