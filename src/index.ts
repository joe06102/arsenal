import "reflect-metadata";
import { program } from "commander";
import { container } from "tsyringe";
import * as Token from "./Constant/Token";
import { DIContainer } from "./DIContainer";
import { ServiceConfigProvider, RCConfigProvider } from "./Abstract/Provider";
import { ArsenalConfig } from "./Abstract/Config";
import { ArsenalCommand, ArsenalCommandOption } from "./Abstract/Command";

export class Arsenal {
  private config: ArsenalConfig;

  constructor() {
    this.config = new ArsenalConfig();
  }

  ConfigVersion(version: string) {
    this.config.Version = version;
    return this;
  }

  ConfigRC(provider: RCConfigProvider) {
    if (typeof provider !== "function") {
      throw new TypeError(
        `expect RCProvider to be function, but got ${provider}`
      );
    }

    provider(this.config.ConfigRCOptions);
    container.register(Token.ConfigToken.ConfigOptions, {
      useValue: this.config.ConfigRCOptions,
    });

    return this;
  }

  ConfigService(provider: ServiceConfigProvider) {
    if (typeof provider !== "function") {
      throw new TypeError(
        `expect ServiceProvider to be function, but got ${provider}`
      );
    }
    //#region internal service registry
    const builtinContainer = new DIContainer(this.config);
    builtinContainer.Initialize();
    //#endregion

    //#region external service registry
    provider(container);
    //#endregion

    return this;
  }

  ConfigCommand(CMD: any) {
    if (!this.config.Commands.find((c) => c.Name === CMD.Name)) {
      this.config.Commands.push(container.resolve(CMD));
    }
    return this;
  }

  Run() {
    // avoid options name clashes
    program.storeOptionsAsProperties(false);
    program.version(this.config.Version);
    program.usage("<command> [options]");

    this.config.Commands.forEach((command) => {
      const cmd = program
        .command(command.Name)
        .action(async function (this: any) {
          const options = this.opts();

          if (command.Pipeline) {
            command.Pipeline.Run(options);
          }
        });

      if (Array.isArray(command.Options)) {
        command.Options.forEach((opt: ArsenalCommandOption<unknown>) => {
          if (opt.Required) {
            cmd.requiredOption(
              opt.Name,
              opt.Description,
              opt.Parse || ((val) => val),
              opt.Default
            );
          } else {
            cmd.option(
              opt.Name,
              opt.Description,
              opt.Parse || ((val) => val),
              opt.Default
            );
          }
        });
      }
    });

    program.parse(process.argv);
    return this;
  }
}

export { ILogger } from "./Abstract/Logger";
export { ArsenalCommand, ArsenalCommandOption } from "./Abstract/Command";
export { IConfig } from "./Abstract/Config";
export { IContext } from "./Abstract/Context";
export { BasicPipeline } from "./Pipeline/BasicPipeline";
export { BailPipeline } from "./Pipeline/BailPipeline";
export { ParallelPipeline } from "./Pipeline/ParallelPipeline";
export * from "./Abstract/CutPoint";
export * from "tsyringe";
export * as Token from "./Constant/Token";
