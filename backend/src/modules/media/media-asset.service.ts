import { NotFoundError } from '../../common/errors';
import { mediaAssetRepository } from './media-asset.dynamodb.repository';

export class MediaAssetService {
  async list(options = {}) {
    return mediaAssetRepository.findAll(options as any);
  }

  async get(id: string) {
    const asset = await mediaAssetRepository.findById(id);

    if (!asset || asset.deletedAt) {
      throw new NotFoundError('Media asset not found');
    }

    return asset;
  }

  async create(data: any) {
    return mediaAssetRepository.create(data);
  }

  async delete(id: string) {
    await this.get(id);
    await mediaAssetRepository.softDelete(id);
  }
}

export const mediaAssetService =
  new MediaAssetService();
