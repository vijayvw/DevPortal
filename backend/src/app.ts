import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

import { config } from './config';
import { requestLogger } from './common/middleware/requestLogger.middleware';
import {
  errorHandler,
  notFoundHandler,
} from './common/middleware/errorHandler.middleware';
import { ApiResponse } from './common/responses/ApiResponse';

import { healthRouter } from './health/health.routes';
import { swaggerSpec } from './docs/swagger';

import { authRouter } from './modules/auth/auth.routes';
import { projectRouter } from './modules/projects/project.routes';
import { projectAdminRouter } from './modules/projects/project.admin.routes';

import { blogPostRouter } from './modules/blog/blog-post.routes';
import { blogPostAdminRouter } from './modules/blog/blog-post.admin.routes';

import { skillRouter } from './modules/skills/skill.routes';
import { skillAdminRouter } from './modules/skills/skill.admin.routes';
import { categoryRouter } from './modules/skills/category.routes';
import { categoryAdminRouter } from './modules/skills/category.admin.routes';

import { technologyRouter } from './modules/technologies/technology.routes';
import { technologyAdminRouter } from './modules/technologies/technology.admin.routes';

import { caseStudyRouter } from './modules/case-studies/case-study.routes';
import { caseStudyAdminRouter } from './modules/case-studies/case-study.admin.routes';

import { contactRouter } from './modules/contact/contact.routes';
import { contactAdminRouter } from './modules/contact/contact.admin.routes';

import { auditLogRouter } from './modules/audit-log/audit-log.routes';

import { dashboardRouter } from './modules/dashboard/dashboard.routes';

import { settingsRouter } from './modules/settings/settings.routes';
import { publicSettingsRouter } from './modules/settings/settings.public.routes';

import { mediaAssetRouter } from './modules/media/media-asset.routes';

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);

  app.use(
    helmet({
      crossOriginResourcePolicy: {
        policy: 'cross-origin',
      },
    }),
  );

  app.use(
    cors({
      origin: config.cors.origin,
      credentials: true,
    }),
  );

  app.use(compression());

  app.use(
    express.json({
      limit: '2mb',
    }),
  );

  app.use(
    express.urlencoded({
      extended: true,
      limit: '2mb',
    }),
  );

  app.use(
    '/uploads',
    express.static(
      path.join(
        process.cwd(),
        'uploads',
      ),
    ),
  );

  app.use(
    rateLimit({
      windowMs:
        config.rateLimit.windowMs,

      max:
        config.rateLimit.maxRequests,

      standardHeaders: true,

      legacyHeaders: false,

      handler: (_req, res) => {
        ApiResponse.error(
          res,
          'Too many requests, please try again later',
          429,
        );
      },
    }),
  );

  app.use(requestLogger);

  app.use(healthRouter);

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec),
  );

  app.get(
    config.server.apiPrefix,
    (_req, res) => {
      ApiResponse.success(res, {
        service: 'DevPortal API',
        version: 'v1',
        environment: config.env,
        timestamp:
          new Date().toISOString(),
      });
    },
  );

  app.use(
    `${config.server.apiPrefix}/auth`,
    authRouter,
  );

  app.use(
    `${config.server.apiPrefix}/projects`,
    projectRouter,
  );

  app.use(
    `${config.server.apiPrefix}/admin/projects`,
    projectAdminRouter,
  );

  app.use(
    `${config.server.apiPrefix}/blog`,
    blogPostRouter,
  );

  app.use(
    `${config.server.apiPrefix}/admin/blog`,
    blogPostAdminRouter,
  );

  app.use(
    `${config.server.apiPrefix}/skills`,
    skillRouter,
  );

  app.use(
    `${config.server.apiPrefix}/skill-categories`,
    categoryRouter,
  );

  app.use(
    `${config.server.apiPrefix}/technologies`,
    technologyRouter,
  );

  app.use(
    `${config.server.apiPrefix}/admin/skills`,
    skillAdminRouter,
  );

  app.use(
    `${config.server.apiPrefix}/admin/skill-categories`,
    categoryAdminRouter,
  );

  app.use(
    `${config.server.apiPrefix}/admin/technologies`,
    technologyAdminRouter,
  );

  app.use(
    `${config.server.apiPrefix}/case-studies`,
    caseStudyRouter,
  );

  app.use(
    `${config.server.apiPrefix}/admin/case-studies`,
    caseStudyAdminRouter,
  );

  app.use(
    `${config.server.apiPrefix}/contact`,
    contactRouter,
  );

  app.use(
    `${config.server.apiPrefix}/admin/contact`,
    contactAdminRouter,
  );

  app.use(
    `${config.server.apiPrefix}/audit-logs`,
    auditLogRouter,
  );

  app.use(
    `${config.server.apiPrefix}/admin/dashboard`,
    dashboardRouter,
  );

  app.use(
    `${config.server.apiPrefix}/settings`,
    publicSettingsRouter,
  );

  app.use(
    `${config.server.apiPrefix}/admin/settings`,
    settingsRouter,
  );

  app.use(
    `${config.server.apiPrefix}/admin/media`,
    mediaAssetRouter,
  );

  app.use(notFoundHandler);

  app.use(errorHandler);

  return app;
}
