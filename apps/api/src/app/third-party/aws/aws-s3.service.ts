import { Inject, Injectable, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { IFileUploadService } from './cloud.service.requirements';
import { IThirdPartyCloudServiceConfig } from '../../config/third-party-cloud-service.config.requirements';

@Injectable()
export class AWSS3Service implements IFileUploadService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(
    @Inject('IThirdPartyServiceConfig')
    private readonly awsMetadataConfigService: IThirdPartyCloudServiceConfig
  ) {
    this.s3Client = new S3Client({
      region: this.awsMetadataConfigService.getServerRegion(),
    });
    this.bucketName = this.awsMetadataConfigService.getCloudStorageBucketName();
  }

  public async uploadFileToBucketStorage(
    fileBuffer: Buffer,
    fileName: string,
    contentType = 'application/pdf'
  ): Promise<string> {
    const uploadParams = {
      Bucket: this.bucketName,
      Key: fileName,
      Body: fileBuffer,
      ContentType: contentType,
    };

    try {
      const command = new PutObjectCommand(uploadParams);
      await this.s3Client.send(command);
      Logger.log(`File successfully uploaded: ${fileName}`);
      return `https://${this.bucketName}.s3.amazonaws.com/${fileName}`;
    } catch (error) {
      Logger.error(`Error uploading to S3: ${error.message}`);
      throw error;
    }
  }
}
