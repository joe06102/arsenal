import { ArsenalCommand, ArsenalCommandOption } from "./Command";

export interface IConfig {
  Get<T>(key: string): T;
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
