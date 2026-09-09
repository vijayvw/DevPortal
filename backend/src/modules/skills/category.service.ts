import {
  ConflictError,
  NotFoundError,
} from '../../common/errors';
import {
  skillCategoryRepository,
  SkillCategoryCreateInput,
  SkillCategoryUpdateInput,
} from './category.dynamodb.repository';

import { skillRepository } from './skill.dynamodb.repository';

export class CategoryService {
  async listPublic() {
    return skillCategoryRepository.findVisible();
  }

  async listAdmin() {
    return skillCategoryRepository.findAll();
  }

  async get(id: string) {
    const category = await skillCategoryRepository.findById(id);

    if (!category || category.deletedAt) {
      throw new NotFoundError('Skill category not found');
    }

    return category;
  }

  async create(data: SkillCategoryCreateInput) {
    const existing = await skillCategoryRepository.existsBySlug(
      data.slug,
    );

    if (existing) {
      throw new ConflictError('Skill category slug already exists');
    }

    return skillCategoryRepository.create({
      ...data,
      id: data.slug,
    });
  }

  async update(
    id: string,
    data: SkillCategoryUpdateInput,
  ) {
    await this.get(id);

    if (data.slug) {
      const existing = await skillCategoryRepository.existsBySlug(
        data.slug,
        id,
      );

      if (existing) {
        throw new ConflictError(
          'Skill category slug already exists',
        );
      }
    }

    return skillCategoryRepository.update(id, data);
  }

  async delete(id: string) {
    const category = await this.get(id);

    const skills = await skillRepository.findAll({
      category: category.slug,
    });

    if (skills.length > 0) {
      throw new ConflictError(
        'Cannot delete a skill category while it contains skills',
      );
    }

    await skillCategoryRepository.softDelete(id);
  }
}

export const categoryService = new CategoryService();
