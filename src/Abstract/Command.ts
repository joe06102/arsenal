import { IPipeline } from "./Pipeline";

export interface IArsenalCommandOption<T = string> {
  Type: string;
  Name: string;
  Description: string;
  Default?: T;
  Required?: boolean;
  Parse?: (raw: string) => T;
}

export interface IArsenalCommand<
  PipelineCutPoint = void | Error,
  Option = unknown
> {
  Name: string;
  Description: string;
  Options: IArsenalCommandOption<Option>[];
  Pipeline: IPipeline<PipelineCutPoint>;
}
