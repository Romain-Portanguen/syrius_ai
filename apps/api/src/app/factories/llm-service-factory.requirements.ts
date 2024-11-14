import { BaseChatModel } from '@langchain/core/language_models/chat_models';

export interface ILLMServiceFactory {
  create(model: 'openai' | 'anthropic' | 'mistral'): BaseChatModel;
}
