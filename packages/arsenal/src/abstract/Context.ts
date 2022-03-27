export type ContextKey = string | symbol;

export interface IContext {
  Get<T>(key: ContextKey): T;
  Set<T>(key: ContextKey, value: T): void;
}
