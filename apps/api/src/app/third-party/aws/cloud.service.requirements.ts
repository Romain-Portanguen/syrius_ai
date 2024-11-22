export interface ICloudService {
  uploadFileToBucketStorage(
    fileBuffer: Buffer,
    fileName: string,
    contentType?: string
  ): Promise<string>;
}
