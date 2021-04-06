import { program } from "commander";
import { container } from "tsyringe";
import { PipelineContext } from "./Abstract/Context";
import { ServiceConfigProvider, RCConfigProvider } from "./Abstract/Provider";
import { ArsenalConfig } from "./Abstract/Config";
import { IArsenalCommand } from "./Abstract/Command";
import { TerminalLogger } from "./Logger/TerminalLogger";
import { InternalConfig } from "./Config/InternalConfig";
import { IPipeline, IPipelineConstructor } from "./Abstract/Pipeline";

export class Arsenal {
  private config: ArsenalConfig;

  constructor() {
    this.config = new ArsenalConfig();
  }

  ConfigVersion(version: string) {
    this.config.Version = version;
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
    //#endregion

    //#region external service registry
    provider(container);
    //#endregion

    return this;
  }

  ConfigCommand(cmd: IArsenalCommand<void | Error, unknown>) {
    if (!this.config.Commands.find((c) => c.Name === cmd.Name)) {
      this.config.Commands.push(cmd);
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
            const pipeline = createPipeline(
              (command.Pipeline as unknown) as IPipelineConstructor<void | Error>,
              options
            );
            pipeline.Run();
          }
        });

      if (Array.isArray(command.Options)) {
        command.Options.forEach((opt) => {
          if (opt.required) {
            cmd.requiredOption(
              opt.name,
              opt.description,
              opt.parse || ((val) => val),
              opt.default
            );
          } else {
            cmd.option(
              opt.name,
              opt.description,
              opt.parse || ((val) => val),
              opt.default
            );
          }
        });
      }
    });

    program.parse(process.argv);
  }
}

function createPipeline(
  ctor: IPipelineConstructor<void | Error>,
  options: Record<string, unknown>
): IPipeline<void | Error> {
  return new ctor(options);
}
