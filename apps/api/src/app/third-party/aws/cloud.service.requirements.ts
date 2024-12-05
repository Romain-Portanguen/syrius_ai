export interface IFileUploadService {
  uploadFileToBucketStorage(
    fileBuffer: Buffer,
    fileName: string,
    contentType?: string
  ): Promise<string>;
}
