import { injectable } from "tsyringe";

type ContextKey = string | symbol;

@injectable()
export class PipelineContext {
  private map: Map<ContextKey, unknown> = new Map();

  Get<T>(key: ContextKey) {
    return this.map.get(key) as T;
  }

  Set<T>(key: ContextKey, value: T) {
    this.map.set(key, value);
  }
}
