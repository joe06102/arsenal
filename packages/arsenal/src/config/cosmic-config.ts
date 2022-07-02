import { cosmiconfigSync } from "cosmiconfig";
import { inject, singleton } from "tsyringe";
import get from "lodash.get";
import { ConfigToken } from "../constant/token";
import { IConfig, ConfigOptions } from "../abstract/config";
import { NotFoundError } from "../abstract/error";

@singleton()
export class CosmicConfig implements IConfig {
  private config: Record<string, unknown>;

  constructor(
    @inject(ConfigToken.ConfigOptions) private configOptions: ConfigOptions
  ) {
    if (!this.configOptions?.Module) {
      throw new TypeError(
        `expect configOptions.Module to be string, but got ${this.configOptions?.Module}`
      );
    }

    const { Module, Required } = this.configOptions;
    const explorer = cosmiconfigSync(Module, {
      stopDir: process.cwd(),
    });
    const result = explorer.search();

    if (!result && Required) {
      throw new NotFoundError(this.getSearchedPaths());
    }

    this.config = result?.config;
  }

  private getSearchedPaths() {
    const name = this.configOptions.Module;
    return [
      `.${name}rc`,
      `.${name}rc.json`,
      `.${name}rc.yaml`,
      `.${name}rc.yml`,
      `.${name}rc.js`,
      `.${name}rc.cjs`,
      `.${name}.config.json`,
      `.${name}.config.js`,
      `.${name}.config.cjs`,
    ].join(",");
  }

  Get<T>(key: string): T {
    return get(this.config as Record<string, unknown>, key) as T;
  }

  GetAll<T>(): T {
    return {
      ...this.config,
    } as unknown as T;
  }
}
