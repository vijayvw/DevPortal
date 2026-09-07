import type { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../common/responses/ApiResponse';
import { blogPostService } from './blog-post.service';

export class BlogPostController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.success(
        res,
        await blogPostService.listPublic(req.query),
      );
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.success(
        res,
        await blogPostService.getPublic(req.params.id),
      );
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      return ApiResponse.success(
        res,
        await blogPostService.getPublicBySlug(
          req.params.slug,
        ),
      );
    } catch (error) {
      next(error);
    }
  }

  async view(req: Request, res: Response, next: NextFunction) {
    try {
      await blogPostService.incrementViews(req.params.id);
      return ApiResponse.success(res, null, 'View recorded');
    } catch (error) {
      next(error);
    }
  }

  async like(req: Request, res: Response, next: NextFunction) {
    try {
      await blogPostService.incrementLikes(req.params.id);
      return ApiResponse.success(res, null, 'Like recorded');
    } catch (error) {
      next(error);
    }
  }

  async unlike(req: Request, res: Response, next: NextFunction) {
    try {
      await blogPostService.decrementLikes(req.params.id);
      return ApiResponse.success(res, null, 'Like removed');
    } catch (error) {
      next(error);
    }
  }
}

export const blogPostController =
  new BlogPostController();
