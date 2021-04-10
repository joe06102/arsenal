import "reflect-metadata";
import { program } from "commander";
import { container } from "tsyringe";
import {
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncParallelHook,
} from "tapable";
import { ServiceConfigProvider, RCConfigProvider } from "./Abstract/Provider";
import { ArsenalConfig } from "./Abstract/Config";
import { TerminalLogger } from "./Logger/TerminalLogger";
import { InternalConfig } from "./Config/InternalConfig";
import { ChainablePipelineContext } from "./Context/ChainablePipelineContext";
import { IPipeline, IPipelineConstructor } from "./Abstract/Pipeline";
import { CutPointType } from "./Constant/CutPoint";

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

    provider(this.config);
    container.register("ConfigRC", { useValue: this.config.RCFile });

    return this;
  }

  ConfigService(provider: ServiceConfigProvider) {
    if (typeof provider !== "function") {
      throw new TypeError(
        `expect ServiceProvider to be function, but got ${provider}`
      );
    }
    //#region internal service registry

    // register internal terminal logger
    container.register("ILogger", {
      useClass: TerminalLogger,
    });

    // register internal ConfigReader
    container.register("IConfig", {
      useClass: InternalConfig,
    });

    // register internal PipelineContext
    container.register("IPipelineContext", {
      useClass: ChainablePipelineContext,
    });

    //tapable registry
    container.register(CutPointType.Basic, {
      useFactory: () => new AsyncSeriesHook(["ctx"]),
    });
    container.register(CutPointType.Bail, {
      useFactory: () => new AsyncSeriesBailHook(["ctx"]),
    });
    container.register(CutPointType.Parallel, {
      useFactory: () => new AsyncParallelHook(["ctx"]),
    });
    //#endregion

    //#region external service registry
    provider(container);
    //#endregion

    return this;
  }

  ConfigCommand(cmd: any) {
    if (!this.config.Commands.find((c) => c.Name === cmd.Name)) {
      this.config.Commands.push(container.resolve(cmd));
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
        command.Options.forEach((opt) => {
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

function createPipeline(
  ctor: IPipelineConstructor<void | Error>
): IPipeline<void | Error> {
  return container.resolve(ctor);
}

export { ILogger } from "./Abstract/Logger";
export { IArsenalCommand, IArsenalCommandOption } from "./Abstract/Command";
export { BasicPipeline } from "./Pipeline/BasicPipeline";
export { BailPipeline } from "./Pipeline/BailPipeline";
export { ParallelPipeline } from "./Pipeline/ParallelPipeline";
export * from "./CutPoint";
export * from "tsyringe";
