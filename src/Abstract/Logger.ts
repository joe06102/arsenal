/**
 * internal logger interface for logging
 */
export interface ILogger {
  Info(...args: string[]): void;
  Success(...args: string[]): void;
  Error(...args: string[]): void;
  Warning(...args: string[]): void;
}
