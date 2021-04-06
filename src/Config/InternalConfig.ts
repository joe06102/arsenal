import fs from "fs";
import get from "lodash.get";
import { inject, singleton } from "tsyringe";
import { IConfig } from "../Abstract/Config";

@singleton()
export class InternalConfig implements IConfig {
  private config: Record<string, any>;

  constructor(@inject("ConfigRC") configFileName: string) {
    if (!fs.existsSync(configFileName)) {
      throw new Error(
        `can not find config file <${configFileName}> in the cwd`
      );
    }

    this.config = require(configFileName);
  }

  Get<T>(key: string): T {
    return get(this.config, key);
  }
}
