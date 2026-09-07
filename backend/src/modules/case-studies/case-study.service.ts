import { NotFoundError } from '../../common/errors';
import { caseStudyRepository } from './case-study.dynamodb.repository';

export class CaseStudyService {
  async listPublic(options = {}) {
    return caseStudyRepository.findAll({
      ...(options as object),
      publicOnly: true,
    });
  }

  async getPublic(id: string) {
    const item = await caseStudyRepository.findById(id);

    if (
      !item ||
      item.publishStatus !== 'PUBLISHED'
    ) {
      throw new NotFoundError('Case study not found');
    }

    return item;
  }

  async listAdmin(options = {}) {
    return caseStudyRepository.findAll(options as any);
  }

  async getAdmin(id: string) {
    const item = await caseStudyRepository.findById(id);

    if (!item) {
      throw new NotFoundError('Case study not found');
    }

    return item;
  }

  async create(data: any) {
    return caseStudyRepository.create(data);
  }

  async update(id: string, data: any) {
    const item = await caseStudyRepository.update(id, data);

    if (!item) {
      throw new NotFoundError('Case study not found');
    }

    return item;
  }

  async delete(id: string) {
    await this.getAdmin(id);
    await caseStudyRepository.softDelete(id);
  }
}

export const caseStudyService =
  new CaseStudyService();
