import { NotFoundError } from '../../common/errors';
import { contactMessageRepository } from './contact-message.dynamodb.repository';

export class ContactMessageService {
  async create(data: any) {
    return contactMessageRepository.create({
      ...data,
      status: 'UNREAD',
      repliedAt: null,
    });
  }

  async list(options = {}) {
    const result = await contactMessageRepository.findAll(options as any);

    return {
      ...result,
      items: result.items.map((item) => ({
        ...item,
        status:
          item.status === 'NEW'
            ? 'UNREAD'
            : item.status,
      })),
    };
  }

  async get(id: string) {
    const item = await contactMessageRepository.findById(id);

    if (!item) {
      throw new NotFoundError('Contact message not found');
    }

    return {
      ...item,
      status:
        item.status === 'NEW'
          ? 'UNREAD'
          : item.status,
    };
  }

  async update(id: string, data: any) {
    const item = await contactMessageRepository.update(id, data);

    if (!item) {
      throw new NotFoundError('Contact message not found');
    }

    return {
      ...item,
      status:
        item.status === 'NEW'
          ? 'UNREAD'
          : item.status,
    };
  }
}

export const contactMessageService =
  new ContactMessageService();
