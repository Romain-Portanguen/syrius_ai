import { Injectable, Inject } from '@nestjs/common';
import {
  Pinecone,
  PineconeRecord,
  QueryOptions,
  QueryResponse,
} from '@pinecone-database/pinecone';
import { IThirdPartyAPIKeyService } from '../../config/third-party-api-key.config.requirements';
import {
  IVectorStorageService,
  VectorRecord,
  VectorQueryOptions,
  VectorQueryResponse,
} from './vector-storage.service.requirements';

@Injectable()
export class PineconeService implements IVectorStorageService {
  private pineconeClient: Pinecone;

  constructor(
    @Inject('IThirdPartyAPIKeyService')
    private readonly thirdPartyApiKeyService: IThirdPartyAPIKeyService
  ) {
    this.pineconeClient = new Pinecone({
      apiKey: this.thirdPartyApiKeyService.getPineconeApiKey(),
    });
  }

  private getIndex(namespace: string) {
    return this.pineconeClient.index(namespace);
  }

  public async upsert(records: VectorRecord[]): Promise<void> {
    const pineconeRecords: PineconeRecord[] = records.map((record) => ({
      id: record.id,
      values: record.values,
      metadata: record.metadata,
    }));
    await this.getIndex('syrius-index').upsert(pineconeRecords);
  }

  public async query(
    options: VectorQueryOptions
  ): Promise<VectorQueryResponse> {
    const queryOptions: QueryOptions = {
      vector: options.vector,
      topK: options.topK,
      includeMetadata: options.includeMetadata,
    };

    const response: QueryResponse = await this.getIndex('syrius-index').query(
      queryOptions
    );

    return {
      matches: response.matches.map((match) => ({
        score: match.score,
        metadata: match.metadata,
      })),
    };
  }
}
