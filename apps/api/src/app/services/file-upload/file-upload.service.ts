import { Inject, Injectable } from '@nestjs/common';
import { ICloudService } from '../../third-party/aws/cloud.service.requirements';
import { IFileUploadService } from './file-upload.service.requirements';

@Injectable()
export class FileUploadService implements IFileUploadService {
  constructor(
    @Inject('ICloudService')
    private readonly awsS3Service: ICloudService
  ) {}

  public async uploadFile(
    fileBuffer: Buffer,
    fileName: string
  ): Promise<string> {
    try {
      return await this.awsS3Service.uploadFileToBucketStorage(
        fileBuffer,
        fileName
      );
    } catch (error) {
      throw new Error(`Error uploading file: ${error.message}`);
    }
  }
}
