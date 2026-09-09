import { randomUUID } from 'crypto';

import {
  ConflictError,
  NotFoundError,
} from '../../common/errors';

import { skillRepository } from './skill.dynamodb.repository';
import { skillCategoryRepository } from './category.dynamodb.repository';

export class SkillService {
  async listPublic() {
    const skills = await skillRepository.findAll();

    return skills
      .filter(
        (skill) =>
          skill.visible &&
          !skill.deletedAt,
      )
      .sort(
        (a, b) =>
          a.priority - b.priority ||
          a.name.localeCompare(b.name) ||
          b.proficiency - a.proficiency,
      );
  }

  async listAdmin() {
    return skillRepository.findAll();
  }

  async get(id: string) {
    const skill = await skillRepository.findById(id);

    if (!skill || skill.deletedAt) {
      throw new NotFoundError('Skill not found');
    }

    return skill;
  }

  async create(data: any) {
    const existing = (
      await skillRepository.findAll()
    ).find(
      (skill) =>
        skill.name.toLowerCase() ===
          data.name.toLowerCase() &&
        !skill.deletedAt,
    );

    if (existing) {
      throw new ConflictError(
        'Skill already exists',
      );
    }

    const categoryId =
      data.categoryId ?? data.category;

    const category =
      await skillCategoryRepository.findById(
        categoryId,
      );

    if (!category) {
      throw new NotFoundError(
        'Skill category not found',
      );
    }

    return skillRepository.create({
      ...data,
      id: randomUUID(),
      category: category.slug,
      categoryId: category.id,
    });
  }

  async update(id: string, data: any) {
    await this.get(id);

    let updateData = {
      ...data,
    };

    if (data.categoryId) {
      const category =
        await skillCategoryRepository.findById(
          data.categoryId,
        );

      if (!category) {
        throw new NotFoundError(
          'Skill category not found',
        );
      }

      updateData = {
        ...updateData,
        category: category.slug,
        categoryId: category.id,
      };
    } else if (data.category) {
      const category =
        await skillCategoryRepository.findById(
          data.category,
        );

      if (!category) {
        throw new NotFoundError(
          'Skill category not found',
        );
      }

      updateData = {
        ...updateData,
        category: category.slug,
        categoryId: category.id,
      };
    }

    return skillRepository.update(
      id,
      updateData,
    );
  }

  async delete(id: string) {
    await this.get(id);
    await skillRepository.softDelete(id);
  }
}

export const skillService = new SkillService();
