import { settingsRepository } from './settings.dynamodb.repository';

export class SettingsService {
  async get() {
    return settingsRepository.get();
  }

  async update(data: any) {
    return settingsRepository.save(data);
  }
}

export const settingsService =
  new SettingsService();
