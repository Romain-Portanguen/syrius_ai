import { Injectable, Logger } from '@nestjs/common';
import { IErrorHandlingService } from './error-handling.service.requirements';

@Injectable()
export class ErrorHandlingService implements IErrorHandlingService {
  public handleError(error: Error): void {
    Logger.error(`An error occurred: ${error.message}`);
    throw new Error(`Operation failed: ${error.message}`);
  }
}
