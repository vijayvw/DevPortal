import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { ApiResponse } from '../../common/responses/ApiResponse';
import { mediaAssetService } from './media-asset.service';
import {
  deleteFromS3,
  uploadToS3,
} from '../../infrastructure/s3/S3StorageService';
import { config } from '../../config';

function extractS3Key(url: string): string {
  const parsed = new URL(url);
  return decodeURIComponent(
    parsed.pathname.replace(/^\/+/, ''),
  );
}

export class MediaAssetController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.success(
        res,
        await mediaAssetService.list(req.query),
      );
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.success(
        res,
        await mediaAssetService.get(req.params.id),
      );
    } catch (error) {
      next(error);
    }
  }

  async upload(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new Error('No image file provided');
      }

      const extension =
        path.extname(req.file.originalname) ||
        '.bin';

      const key =
        `media/${randomUUID()}${extension}`;

      const url = await uploadToS3(
        key,
        req.file.buffer,
        req.file.mimetype,
      );

      const asset = await mediaAssetService.create({
        filename: req.file.originalname,
        url,
        mimeType: req.file.mimetype,
        size: req.file.size,
        folder:
          typeof req.body.folder === 'string'
            ? req.body.folder
            : undefined,
        uploadedById: req.user?.id,
      });

      return ApiResponse.created(
        res,
        asset,
        'Media uploaded successfully',
      );
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const asset = await mediaAssetService.get(
        req.params.id,
      );

      await deleteFromS3(
        extractS3Key(asset.url),
      );

      await mediaAssetService.delete(req.params.id);

      return ApiResponse.noContent(res);
    } catch (error) {
      next(error);
    }
  }
}

export const mediaAssetController =
  new MediaAssetController();
