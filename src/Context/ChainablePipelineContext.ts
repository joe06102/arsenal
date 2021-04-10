import { IPipelineContext, ContextKey } from "../Abstract/Context";

export class ChainablePipelineContext implements IPipelineContext {
  private map: Map<ContextKey, unknown> = new Map();

  private getKeys(key: ContextKey) {
    if (typeof key === "symbol") return [key];

    const keys = [];
    let curKey = "";

    for (let i = 0; i < key.length; i++) {
      switch (key[i]) {
        case ".":
        case "]": {
          keys.push(curKey);
          curKey = "";
          break;
        }
        case "[": {
          continue;
        }
        default: {
          curKey += key[i];
          break;
        }
      }
    }

    keys.push(curKey);
    return keys;
  }

  Get<T>(key: ContextKey) {
    let i = 0;
    const keys = this.getKeys(key);
    let ret = this.map.get(keys[i]) as any;

    while (ret != null) {
      if (++i >= keys.length) {
        break;
      }

      ret = ret[keys[i]];
    }

    return ret as T;
  }

  Set<T>(key: ContextKey, value: T) {
    this.map.set(key, value);
  }
}
