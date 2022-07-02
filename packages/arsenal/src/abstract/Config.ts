import { ArsenalCommand, ArsenalCommandOption } from "./command";

export interface IConfig {
  Get<T>(key: string): T;
  GetAll<T>(): T;
}

export class ArsenalConfig {
  constructor(
    public Version = "",
    public ConfigRCOptions = new ConfigOptions(),
    public Commands: ArsenalCommand<void | Error, unknown>[] = []
  ) {}
}

export class ConfigOptions {
  constructor(public Module?: string, public Required = true) {}
}
