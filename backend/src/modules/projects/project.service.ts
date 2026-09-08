import {
  NotFoundError,
} from '../../common/errors';
import { projectRepository } from './project.dynamodb.repository';
import { technologyRepository } from '../technologies/technology.dynamodb.repository';
import { mediaAssetRepository } from '../media/media-asset.dynamodb.repository';

async function resolveTechnologies(project: any) {
  if (Array.isArray(project.technologies)) {
    return project.technologies.map((technology: any) =>
      typeof technology === 'string'
        ? technology
        : technology?.name ?? technology?.id,
    );
  }

  if (Array.isArray(project.technologyIds)) {
    const technologies = await Promise.all(
      project.technologyIds.map((id: string) =>
        technologyRepository.findById(id),
      ),
    );

    return technologies
      .filter(Boolean)
      .map((technology: any) => technology.name);
  }

  return [];
}

async function resolveMediaUrl(id?: string | null) {
  if (!id) {
    return null;
  }

  const asset = await mediaAssetRepository.findById(id);

  return asset?.deletedAt ? null : asset?.url ?? null;
}

async function resolveGalleryImages(ids?: string[] | null) {
  if (!Array.isArray(ids) || ids.length === 0) {
    return [];
  }

  const assets = await Promise.all(
    ids.map((id: string) => mediaAssetRepository.findById(id)),
  );

  return assets
    .filter((asset: any) => asset && !asset.deletedAt)
    .map((asset: any) => asset.url)
    .filter(Boolean);
}

async function toPublicProject(project: any) {
  const [technologies, coverImageUrl, galleryImages] = await Promise.all([
    resolveTechnologies(project),
    resolveMediaUrl(project.coverImageId),
    resolveGalleryImages(project.galleryImageIds),
  ]);

  return {
    ...project,
    longDescription:
      project.longDescription ??
      project.description ??
      null,
    technologies,
    coverImageUrl,
    galleryImages,
  };
}

export class ProjectService {
  async listPublic(options = {}) {
    const result = await projectRepository.findAll({
      ...(options as object),
      publicOnly: true,
    });

    return {
      ...result,
      items: await Promise.all(
        result.items.map((project: any) =>
          toPublicProject(project),
        ),
      ),
    };
  }

  async getPublic(id: string) {
    const project = await projectRepository.findById(id);

    if (
      !project ||
      project.publishStatus !== 'PUBLISHED'
    ) {
      throw new NotFoundError('Project not found');
    }

    return toPublicProject(project);
  }

  async getPublicBySlug(slug: string) {
    const project = await projectRepository.findBySlug(slug);

    if (
      !project ||
      project.publishStatus !== 'PUBLISHED'
    ) {
      throw new NotFoundError('Project not found');
    }

    return toPublicProject(project);
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

    if (!project || project.deletedAt) {
      throw new NotFoundError('Project not found');
    }

    return {
      ...project,
      longDescription:
        project.longDescription ??
        project.description ??
        '',
    };
  }

  async create(data: any) {
    const normalized = {
      ...data,
      longDescription:
        data.longDescription ??
        data.description ??
        '',
    };

    // Keep the canonical project description field as longDescription.
    // description is supported only as a legacy input.
    delete normalized.description;

    return projectRepository.create(normalized);
  }

  async update(id: string, data: any) {
    const normalized = {
      ...data,
    };

    // Keep existing projects compatible while using longDescription
    // as the canonical field for all new updates.
    if (
      Object.prototype.hasOwnProperty.call(
        data,
        'description',
      ) &&
      !Object.prototype.hasOwnProperty.call(
        data,
        'longDescription',
      )
    ) {
      normalized.longDescription = data.description;
    }

    delete normalized.description;

    const project = await projectRepository.update(
      id,
      normalized,
    );

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    return {
      ...project,
      longDescription:
        project.longDescription ??
        project.description ??
        '',
    };
  }

  async updateStatus(
    id: string,
    publishStatus: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED',
  ) {
    const project = await this.getAdmin(id);

    const updates: any = {
      publishStatus,
      publishedAt:
        publishStatus === 'PUBLISHED'
          ? (project as any).publishedAt ?? new Date().toISOString()
          : null,
    };

    return projectRepository.update(id, updates);
  }

  async delete(id: string) {
    await this.getAdmin(id);
    await projectRepository.softDelete(id);
  }
}

export const projectService = new ProjectService();
