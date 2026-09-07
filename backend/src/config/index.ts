import dotenv from 'dotenv';
import path from 'path';
import { envSchema } from './env.schema';

const nodeEnv =
  process.env.NODE_ENV || 'development';

const envFileMap: Record<string, string> = {
  development: '.env.development',
  staging: '.env.staging',
  production: '.env.production',
  test: '.env.test',
};

const envFile =
  envFileMap[nodeEnv] || '.env.development';

dotenv.config({
  path: path.resolve(process.cwd(), envFile),
  override: false,
});

dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
  override: false,
});

const parsed = envSchema.safeParse(
  process.env,
);

if (!parsed.success) {
  console.error(
    `\n❌ Invalid environment configuration (loaded from ${envFile}):\n`,
  );

  for (const issue of parsed.error.issues) {
    console.error(
      `  • ${issue.path.join('.')}: ${issue.message}`,
    );
  }

  console.error(
    '\nFix the environment variables above and restart.\n',
  );

  process.exit(1);
}

const env = parsed.data;

export const config = {
  env: env.NODE_ENV,

  isDevelopment:
    env.NODE_ENV === 'development',

  isStaging:
    env.NODE_ENV === 'staging',

  isProduction:
    env.NODE_ENV === 'production',

  isTest:
    env.NODE_ENV === 'test',

  server: {
    port: env.PORT,
    apiPrefix: env.API_PREFIX,
  },

  jwt: {
    accessSecret: env.JWT_ACCESS_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    accessExpiry: env.JWT_ACCESS_EXPIRY,
    refreshExpiry: env.JWT_REFRESH_EXPIRY,
  },

  email: {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
    from: env.EMAIL_FROM,
  },

  aws: {
    region: env.AWS_REGION,
    tableName: env.DYNAMODB_TABLE,
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey:
      env.AWS_SECRET_ACCESS_KEY,
    s3Bucket: env.AWS_S3_BUCKET,
  },

  upload: {
    driver: env.UPLOAD_DRIVER,
    localPath: env.UPLOAD_LOCAL_PATH,
    maxFileSizeMb:
      env.UPLOAD_MAX_FILE_SIZE_MB,
  },

  cors: {
    origin: env.CORS_ORIGIN
      .split(',')
      .map((o) => o.trim()),
  },

  rateLimit: {
    windowMs:
      env.RATE_LIMIT_WINDOW_MS,

    maxRequests:
      env.RATE_LIMIT_MAX_REQUESTS,

    loginWindowMs:
      env.LOGIN_RATE_LIMIT_WINDOW_MS,

    loginMaxRequests:
      env.LOGIN_RATE_LIMIT_MAX_REQUESTS,
  },

  logging: {
    level: env.LOG_LEVEL,
  },
};
