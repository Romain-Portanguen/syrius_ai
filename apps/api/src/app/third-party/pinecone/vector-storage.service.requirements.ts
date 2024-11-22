import { RecordMetadata } from '@pinecone-database/pinecone';

export interface VectorRecord {
  id: string;
  values: number[];
  metadata: RecordMetadata;
}

export interface VectorQueryOptions {
  vector: number[];
  topK: number;
  includeMetadata?: boolean;
}

export interface VectorQueryResponse {
  matches: Array<{
    score: number;
    metadata: RecordMetadata;
  }>;
}

export interface IVectorStorageService {
  upsert(records: VectorRecord[]): Promise<void>;
  query(options: VectorQueryOptions): Promise<VectorQueryResponse>;
}
