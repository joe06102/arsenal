import { IArsenalCommand, IArsenalCommandOption, injectable } from "../..";
import { InitPipeline } from "../Pipeline/InitPipeline";

@injectable()
export class InitCommand implements IArsenalCommand {
  Name = "init";
  Description = "init your cli";
  Options: IArsenalCommandOption<string>[] = [
    {
      Name: "--name [string]",
      Required: true,
      Description: "your app name",
      Type: "static",
      Parse: (val: string) => val,
    },
  ];

  constructor(public Pipeline: InitPipeline) {}
}
