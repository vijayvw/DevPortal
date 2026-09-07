import { Router } from 'express';
import { mediaAssetController } from './media-asset.controller';
import { requireAuth } from '../../common/middleware/auth.middleware';
import { requireRoles } from '../../common/middleware/rbac.middleware';
import { upload } from '../../common/middleware/upload.middleware';

export const mediaAssetRouter = Router();

mediaAssetRouter.use(
  requireAuth,
  requireRoles('ADMIN', 'EDITOR'),
);

mediaAssetRouter.get(
  '/',
  mediaAssetController.list.bind(mediaAssetController),
);

mediaAssetRouter.get(
  '/:id',
  mediaAssetController.get.bind(mediaAssetController),
);

mediaAssetRouter.post(
  '/',
  upload.single('file'),
  mediaAssetController.upload.bind(mediaAssetController),
);

mediaAssetRouter.delete(
  '/:id',
  requireRoles('ADMIN'),
  mediaAssetController.delete.bind(mediaAssetController),
);
