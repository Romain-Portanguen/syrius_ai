import { Module } from '@nestjs/common';
import { AnthropicPromptGeneratorService } from '../services/llm/anthropic/anthropic-prompt-generator.service';
import { AWSMetadataConfigService } from '../config/aws-metadata.config';
import { AWSS3Service } from '../third-party/aws/aws-s3.service';
import { ChunkManagerService } from '../services/chunks/chunk-manager.service';
import { DocumentProcessingService } from '../services/document/document-processing.service';
import { EmbeddingRepository } from '../repositories/embedding/embedding-repository.service';
import { EmbeddingServiceLogger } from '../services/embeddings/embedding-service-logger.service';
import { ErrorHandlingService } from '../services/error-handling/error-handling.service';
import { FileController } from '../controllers/file.controller';
import { FileExtractorService } from '../services/file-extractor/file-extractor.service';
import { FileUploadService } from '../services/file-upload/file-upload.service';
import { LLMServiceFactory } from '../factories/llm-service-factory';
import { MistralPromptGeneratorService } from '../services/llm/mistral/mistral-prompt-generator.service';
import { OpenAIEmbeddingService } from '../services/embeddings/embeddings.service';
import { OpenAIPromptGeneratorService } from '../services/llm/openai/openai-prompt-generator.service';
import { PineconeService } from '../third-party/pinecone/pinecone.service';
import { ThirdPartyAPIKeyService } from '../config/third-party-api-key.config';

@Module({
  controllers: [FileController],
  providers: [
    {
      provide: 'IAnthropicPromptGenerator',
      useClass: AnthropicPromptGeneratorService,
    },
    { provide: 'IChunkManagerService', useClass: ChunkManagerService },
    { provide: 'ICloudService', useClass: AWSS3Service },
    {
      provide: 'IDocumentProcessingService',
      useClass: DocumentProcessingService,
    },
    { provide: 'IEmbeddingRepository', useClass: EmbeddingRepository },
    { provide: 'IEmbeddingService', useClass: OpenAIEmbeddingService },
    { provide: 'IEmbeddingServiceLogger', useClass: EmbeddingServiceLogger },
    { provide: 'IErrorHandlingService', useClass: ErrorHandlingService },
    { provide: 'IFileExtractorService', useClass: FileExtractorService },
    { provide: 'IFileUploadService', useClass: FileUploadService },
    { provide: 'ILLMServiceFactory', useClass: LLMServiceFactory },
    {
      provide: 'IMistralPromptGenerator',
      useClass: MistralPromptGeneratorService,
    },
    {
      provide: 'IOpenAIPromptGenerator',
      useClass: OpenAIPromptGeneratorService,
    },
    { provide: 'IThirdPartyAPIKeyService', useClass: ThirdPartyAPIKeyService },
    { provide: 'IThirdPartyServiceConfig', useClass: AWSMetadataConfigService },
    { provide: 'IVectorStorageService', useClass: PineconeService },
  ],
})
export class FileModule {}
