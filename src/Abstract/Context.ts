export type ContextKey = string | symbol;

export interface IPipelineContext {
  Get<T>(key: ContextKey): T;
  Set<T>(key: ContextKey, value: T): void;
}
