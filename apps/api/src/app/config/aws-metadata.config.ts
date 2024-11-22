import { Injectable } from '@nestjs/common';
import { IThirdPartyCloudServiceConfig } from './third-party-cloud-service.config.requirements';

@Injectable()
export class AWSMetadataConfigService implements IThirdPartyCloudServiceConfig {
  getServerRegion(): string {
    return process.env.AWS_REGION || 'us-east-1';
  }

  getCloudStorageBucketName(): string {
    return process.env.S3_BUCKET_NAME || '';
  }
}
