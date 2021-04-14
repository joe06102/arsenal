import { container } from "tsyringe";
import { ConfigOptions } from "./Config";

export interface ServiceConfigProvider {
  (diContainer: typeof container): void;
}

export interface RCConfigProvider {
  (options: ConfigOptions): void;
}
