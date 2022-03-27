import { container } from "tsyringe";
import { ConfigOptions } from "./config";

export interface ServiceConfigProvider {
  (diContainer: typeof container): void;
}

export interface RCConfigProvider {
  (options: ConfigOptions): void;
}
