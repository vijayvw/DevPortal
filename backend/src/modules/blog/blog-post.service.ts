import { NotFoundError } from '../../common/errors';
import { blogPostRepository } from './blog-post.dynamodb.repository';

export class BlogPostService {
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

    return post;
  }

  async getPublicBySlug(slug: string) {
    const post = await blogPostRepository.findBySlug(slug);

    if (
      !post ||
      post.publishStatus !== 'PUBLISHED'
    ) {
      throw new NotFoundError('Blog post not found');
    }

    return post;
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

    return post;
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

  async delete(id: string) {
    await this.getAdmin(id);
    await blogPostRepository.softDelete(id);
  }
}

export const blogPostService =
  new BlogPostService();
