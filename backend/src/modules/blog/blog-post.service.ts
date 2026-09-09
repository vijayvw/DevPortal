import { mediaAssetRepository } from '../media/media-asset.dynamodb.repository';

import { NotFoundError } from '../../common/errors';
import { blogPostRepository } from './blog-post.dynamodb.repository';

export class BlogPostService {
  private async attachHeroImage(post: any) {
    if (!post.heroImageId) {
      return {
        ...post,
        heroImageUrl: null,
      };
    }

    const asset = await mediaAssetRepository.findById(post.heroImageId);

    return {
      ...post,
      heroImageUrl:
        asset && !asset.deletedAt
          ? asset.url
          : null,
    };
  }
  async listPublic(options = {}) {
    return blogPostRepository.findAll({
      ...(options as object),
      publicOnly: true,
    });
  }

  async getPublic(id: string) {
    const post = await blogPostRepository.findById(id);

    if (
      !post ||
      post.publishStatus !== 'PUBLISHED'
    ) {
      throw new NotFoundError('Blog post not found');
    }

    return this.attachHeroImage({
      ...post,
      views: post.views ?? 0,
      likes: post.likes ?? 0,
      commentsCount: post.commentsCount ?? 0,
    });
  }

  async getPublicBySlug(slug: string) {
    const post = await blogPostRepository.findBySlug(slug);

    if (
      !post ||
      post.publishStatus !== 'PUBLISHED'
    ) {
      throw new NotFoundError('Blog post not found');
    }

    return this.attachHeroImage({
      ...post,
      views: post.views ?? 0,
      likes: post.likes ?? 0,
      commentsCount: post.commentsCount ?? 0,
    });
  }

  async incrementViews(id: string) {
    await this.getPublic(id);
    await blogPostRepository.incrementViews(id);
  }

  async incrementLikes(id: string) {
    await this.getPublic(id);
    await blogPostRepository.incrementLikes(id);
  }

  async decrementLikes(id: string) {
    await this.getPublic(id);
    await blogPostRepository.decrementLikes(id);
  }

  async listAdmin(options = {}) {
    return blogPostRepository.findAll(options as any);
  }

  async getAdmin(id: string) {
    const post = await blogPostRepository.findById(id);

    if (!post) {
      throw new NotFoundError('Blog post not found');
    }

    return this.attachHeroImage({
      ...post,
      views: post.views ?? 0,
      likes: post.likes ?? 0,
      commentsCount: post.commentsCount ?? 0,
    });
  }

  async create(data: any) {
    return blogPostRepository.create(data);
  }

  async update(id: string, data: any) {
    const post = await blogPostRepository.update(id, data);

    if (!post) {
      throw new NotFoundError('Blog post not found');
    }

    return post;
  }

  async updateStatus(
    id: string,
    publishStatus: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED',
  ) {
    const post = await this.getAdmin(id);

    const updates: any = {
      publishStatus,
      publishedAt:
        publishStatus === 'PUBLISHED'
          ? (post as any).publishedAt ?? new Date().toISOString()
          : null,
    };

    return blogPostRepository.update(id, updates);
  }

  async delete(id: string) {
    await this.getAdmin(id);
    await blogPostRepository.softDelete(id);
  }
}

export const blogPostService =
  new BlogPostService();
