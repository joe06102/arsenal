import { IArsenalCommand, IArsenalCommandOption } from "./Command";

export interface IConfig {
  Get<T>(key: string): T;
}

export class ArsenalConfig {
  Version = "";
  ConfigFile = "";
  Commands: IArsenalCommand<void | Error, unknown>[] = [];
}
