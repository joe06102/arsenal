import { IPipeline } from "./Pipeline";

export interface IArsenalCommandOption<T> {
  Type: string;
  Name: string;
  Description: string;
  Default?: T;
  Parse(raw: string): T;
}

export interface IArsenalCommand<PipelineCutPoint, Option> {
  Name: string;
  Description: string;
  Required?: boolean;
  Options: IArsenalCommandOption<Option>;
  Pipeline: IPipeline<PipelineCutPoint>;
}
