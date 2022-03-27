import { Pipeline } from "./pipeline";

export class ArsenalCommandOption<T = string> {
  constructor(
    public Type: string,
    public Name: string,
    public Description: string,
    public Default?: T,
    public Required?: boolean,
    public Parse?: (raw: string) => T
  ) {}
}

export abstract class ArsenalCommand<
  PipelineCutPoint = void | Error,
  Option = unknown
> {
  abstract Name: string;
  abstract Description: string;
  abstract Options: ArsenalCommandOption<Option>[];
  abstract Pipeline: Pipeline<PipelineCutPoint>;
}
