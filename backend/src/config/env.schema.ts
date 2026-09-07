import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'staging', 'production', 'test'])
    .default('development'),

  PORT: z.coerce.number().int().positive().default(4000),

  API_PREFIX: z.string().default('/api/v1'),

  AWS_REGION: z.string().min(1, 'AWS_REGION is required'),

  DYNAMODB_TABLE: z
    .string()
    .min(1, 'DYNAMODB_TABLE is required'),

  JWT_ACCESS_SECRET: z
    .string()
    .min(16, 'JWT_ACCESS_SECRET must be at least 16 characters'),

  JWT_REFRESH_SECRET: z
    .string()
    .min(16, 'JWT_REFRESH_SECRET must be at least 16 characters'),

  JWT_ACCESS_EXPIRY: z.string().default('15m'),

  JWT_REFRESH_EXPIRY: z.string().default('7d'),

  SMTP_HOST: z.string().optional(),

  SMTP_PORT: z.coerce.number().int().optional(),

  SMTP_USER: z.string().optional(),

  SMTP_PASS: z.string().optional(),

  EMAIL_FROM: z.string().optional(),

  AWS_ACCESS_KEY_ID: z.string().optional(),

  AWS_SECRET_ACCESS_KEY: z.string().optional(),

  AWS_S3_BUCKET: z.string().optional(),

  UPLOAD_DRIVER: z
    .enum(['local', 's3'])
    .default('local'),

  UPLOAD_LOCAL_PATH: z
    .string()
    .default('./uploads'),

  UPLOAD_MAX_FILE_SIZE_MB: z
    .coerce.number()
    .int()
    .positive()
    .default(10),

  CORS_ORIGIN: z
    .string()
    .default('http://localhost:5173'),

  RATE_LIMIT_WINDOW_MS: z
    .coerce.number()
    .int()
    .positive()
    .default(15 * 60 * 1000),

  RATE_LIMIT_MAX_REQUESTS: z
    .coerce.number()
    .int()
    .positive()
    .default(100),

  LOGIN_RATE_LIMIT_WINDOW_MS: z
    .coerce.number()
    .int()
    .positive()
    .default(15 * 60 * 1000),

  LOGIN_RATE_LIMIT_MAX_REQUESTS: z
    .coerce.number()
    .int()
    .positive()
    .default(10),

  LOG_LEVEL: z
    .enum([
      'fatal',
      'error',
      'warn',
      'info',
      'debug',
      'trace',
      'silent',
    ])
    .default('info'),
});
