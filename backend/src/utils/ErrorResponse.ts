// Class used for messages in errorHandler middleware
export class ErrorResponse extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);
    const error = this;
    error.statusCode = statusCode;
  }
}
