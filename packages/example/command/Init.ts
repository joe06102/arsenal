import { ArsenalCommand, ArsenalCommandOption, injectable } from "jsouee-arsenal";
import { InitPipeline } from "../pipeline/init-pipeline";

@injectable()
export class InitCommand extends ArsenalCommand {
  Name = "init";
  Description = "init your cli";
  Options: ArsenalCommandOption<string>[] = [
    {
      Name: "--name [string]",
      Required: true,
      Description: "your app name",
      Type: "static",
      Parse: (val: string) => val,
    },
  ];

  constructor(public Pipeline: InitPipeline) {
    super();
  }
}
