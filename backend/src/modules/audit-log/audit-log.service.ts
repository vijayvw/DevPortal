import { auditLogRepository } from './audit-log.dynamodb.repository';

export class AuditLogService {
  async record(data: any) {
    try {
      return await auditLogRepository.create(data);
    } catch (error) {
      console.error('Failed to create audit log', error);
      return null;
    }
  }

  async list(options = {}) {
    return auditLogRepository.findAll(options as any);
  }
}

export const auditLogService =
  new AuditLogService();
