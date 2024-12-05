import {
  Body,
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AskBody, AskResponse } from '../dtos/ask.dto';
import { File } from '../dtos/file.dto';
import { IChunkManagerService } from '../services/chunks/chunk-manager.service.requirements';
import { IEmbeddingRepository } from '../repositories/embedding/embedding-repository.service.requirements';
import { IFileExtractorService } from '../services/file-extractor/file-extractor.service.requirements';
import { IRAGFileUploadService } from '../services/file-upload/file-upload.service.requirements';
import { ILLMServiceFactory } from '../factories/llm-service-factory.requirements';

@Controller('rag')
export class FileController {
  constructor(
    @Inject('IEmbeddingRepository')
    private readonly embeddingRepository: IEmbeddingRepository,
    @Inject('IChunkManagerService')
    private readonly chunkManagerService: IChunkManagerService,
    @Inject('IFileExtractorService')
    private readonly fileExtractorService: IFileExtractorService,
    @Inject('IFileUploadService')
    private readonly fileUploadService: IRAGFileUploadService,
    @Inject('ILLMServiceFactory')
    private readonly llmServiceFactory: ILLMServiceFactory
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(@UploadedFile() file: File): Promise<string> {
    if (!file) throw new Error('No file uploaded');
    const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
    if (!fileExtension) throw new Error('Unable to determine file extension');

    const fileUrl = await this.fileUploadService.uploadFile(
      file.buffer,
      file.originalname
    );
    const content = await this.fileExtractorService.extractContent(
      file.buffer,
      fileExtension
    );
    const chunks = await this.chunkManagerService.chunkDocument(content || '');
    await this.embeddingRepository.saveChunks(chunks);

    return `File uploaded successfully: ${fileUrl}`;
  }

  @Post('ask')
  public async ask(@Body() body: AskBody): Promise<AskResponse> {
    const { context, contextIsRelevant } =
      await this.embeddingRepository.getRelevantContext(body.question);
    if (!contextIsRelevant)
      return {
        answer: 'Unfortunately, no context-specific information was found.',
      };

    const llmService = this.llmServiceFactory.create(body.model);
    const answer = await llmService.askQuestion(
      body.question,
      context,
      contextIsRelevant
    );
    return { answer };
  }
}
