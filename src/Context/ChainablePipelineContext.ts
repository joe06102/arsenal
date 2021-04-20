import { IContext, ContextKey } from "../Abstract/Context";

export class ChainablePipelineContext implements IContext {
  private map: Map<ContextKey, unknown> = new Map();
  private setKeyReg = /\.|\[|\]/;

  private getKeys(key: ContextKey) {
    if (typeof key === "symbol") return [key];

    const keys = [];
    let curKey = "";

    for (let i = 0; i < key.length; i++) {
      switch (key[i]) {
        case ".":
        case "]": {
          if (curKey) {
            keys.push(curKey);
            curKey = "";
          }
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

    curKey && keys.push(curKey);
    return keys;
  }

  Get<T>(key: ContextKey) {
    if (typeof key === "symbol") return this.map.get(key) as T;

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
    if (typeof key === "string" && this.setKeyReg.test(key)) {
      throw new TypeError(`nest prop setting is not supported, key: ${key}`);
    }

    this.map.set(key, value);
  }
}
