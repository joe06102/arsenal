import { container } from "tsyringe";
import { ArsenalConfig } from "./Config";

export interface ServiceConfigProvider {
  (diContainer: typeof container): void;
}

export interface RCConfigProvider {
  (config: ArsenalConfig): void;
}
