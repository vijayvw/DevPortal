import {
  NotFoundError,
} from '../../common/errors';
import { projectRepository } from './project.dynamodb.repository';

export class ProjectService {
  async listPublic(options = {}) {
    return projectRepository.findAll({
      ...(options as object),
      publicOnly: true,
    });
  }

  async getPublic(id: string) {
    const project = await projectRepository.findById(id);

    if (
      !project ||
      project.publishStatus !== 'PUBLISHED'
    ) {
      throw new NotFoundError('Project not found');
    }

    return project;
  }

  async getPublicBySlug(slug: string) {
    const project = await projectRepository.findBySlug(slug);

    if (
      !project ||
      project.publishStatus !== 'PUBLISHED'
    ) {
      throw new NotFoundError('Project not found');
    }

    return project;
  }

  async incrementViews(id: string) {
    await this.getPublic(id);
    await projectRepository.incrementViews(id);
  }

  async incrementLikes(id: string) {
    await this.getPublic(id);
    await projectRepository.incrementLikes(id);
  }

  async decrementLikes(id: string) {
    await this.getPublic(id);
    await projectRepository.decrementLikes(id);
  }

  async listAdmin(options = {}) {
    return projectRepository.findAll(options as any);
  }

  async getAdmin(id: string) {
    const project = await projectRepository.findById(id);

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    return project;
  }

  async create(data: any) {
    return projectRepository.create(data);
  }

  async update(id: string, data: any) {
    const project = await projectRepository.update(id, data);

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    return project;
  }

  async delete(id: string) {
    await this.getAdmin(id);
    await projectRepository.softDelete(id);
  }
}

export const projectService = new ProjectService();
