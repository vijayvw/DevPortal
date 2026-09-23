import { NotFoundError } from '../../common/errors';
import { contactMessageRepository } from './contact-message.dynamodb.repository';
import { sendEmail } from '../../infrastructure/email/SesEmailService';
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

  async delete(id: string) {
    const deleted = await contactMessageRepository.delete(id);

    if (!deleted) {
      throw new NotFoundError('Contact message not found');
    }

    return {
      id,
      deleted: true,
    };
  }

  async reply(id: string, message: string) {
    const item = await contactMessageRepository.findById(id);

    if (!item) {
      throw new NotFoundError('Contact message not found');
    }

    const subject = item.subject.toLowerCase().startsWith('re:')
      ? item.subject
      : `Re: ${item.subject}`;

    await sendEmail({
      to: item.email,
      subject,
      text: message,
    });

    const repliedAt = new Date().toISOString();

    return contactMessageRepository.update(id, {
      status: 'REPLIED',
      repliedAt,
    });
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
