export default interface ErrorResponse {
  error: Error;
  cause?: string;
  errorMessage: string;
}

type Error =
  | "Unsupported Media Type"
  | "Method Not Allowed"
  | "Not Found"
  | "GoneException"
  | "ForbiddenOperationException"
  | "TooManyRequestsException";
