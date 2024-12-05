export interface IRAGFileUploadService {
  uploadFile(fileBuffer: Buffer, fileName: string): Promise<string>;
}
