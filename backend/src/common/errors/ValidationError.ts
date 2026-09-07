import { AppError } from './AppError';

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', errors?: unknown) {
    super(message, 422, true, errors);
    this.name = 'ValidationError';
  }
}
