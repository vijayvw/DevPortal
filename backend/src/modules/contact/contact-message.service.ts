import { NotFoundError } from '../../common/errors';
import { contactMessageRepository } from './contact-message.dynamodb.repository';

export class ContactMessageService {
  async create(data: any) {
    return contactMessageRepository.create({
      ...data,
      status: data.status ?? 'NEW',
    });
  }

  async list(options = {}) {
    return contactMessageRepository.findAll(options as any);
  }

  async get(id: string) {
    const item = await contactMessageRepository.findById(id);

    if (!item) {
      throw new NotFoundError('Contact message not found');
    }

    return item;
  }

  async update(id: string, data: any) {
    const item = await contactMessageRepository.update(id, data);

    if (!item) {
      throw new NotFoundError('Contact message not found');
    }

    return item;
  }
}

export const contactMessageService =
  new ContactMessageService();
