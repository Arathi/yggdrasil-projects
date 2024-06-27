import ErrorResponse from "./domains/yggdrasil/error";

export default interface YggdrasilException extends Error {
  error?: ErrorResponse["error"];
}
