class ApiError extends Error {
  statusCode: number;
  data: null;
  success: boolean;
  error: any[];
  constructor(
    statusCode: number,
    message = "Something went wrong",
    error: any[] = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.data = null;
    this.success = false;
    this.error = error;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

class ApiSuccess {
  statusCode: number;
  data: any;
  success: boolean;
  message: string;
  constructor(statusCode: number, message = "Success", data: any) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode < 400;
  }
}

export { ApiError, ApiSuccess };
