import {
  ConflictError,
  NotFoundError,
} from '../../common/errors';
import { technologyRepository } from './technology.dynamodb.repository';

export class TechnologyService {
  async list(search?: string) {
    let technologies = await technologyRepository.findAll();

    technologies = technologies.filter(
      (technology) => !technology.deletedAt,
    );

    if (search) {
      const term = search.toLowerCase();

      technologies = technologies.filter(
        (technology) =>
          technology.name.toLowerCase().includes(term) ||
          technology.slug.toLowerCase().includes(term),
      );
    }

    return technologies.sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }

  async get(id: string) {
    const technology = await technologyRepository.findById(id);

    if (!technology || technology.deletedAt) {
      throw new NotFoundError('Technology not found');
    }

    return technology;
  }

  async create(data: any) {
    const all = await technologyRepository.findAll();

    if (
      all.some(
        (item) =>
          !item.deletedAt &&
          (
            item.name.toLowerCase() ===
              data.name.toLowerCase() ||
            item.slug.toLowerCase() ===
              data.slug.toLowerCase()
          ),
      )
    ) {
      throw new ConflictError(
        'Technology name or slug already exists',
      );
    }

    return technologyRepository.create(data);
  }

  async update(id: string, data: any) {
    await this.get(id);
    return technologyRepository.update(id, data);
  }

  async delete(id: string) {
    await this.get(id);
    await technologyRepository.softDelete(id);
  }
}

export const technologyService =
  new TechnologyService();
