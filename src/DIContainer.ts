import { container } from "tsyringe";
import {
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncParallelHook,
} from "tapable";
import { TerminalLogger } from "./Logger/TerminalLogger";
import { CosmicConfig } from "./Config/CosmicConfig";
import { ChainablePipelineContext } from "./Context/ChainablePipelineContext";
import { ArsenalConfig } from "./Abstract/Config";
import * as Token from "./Constant/Token";

export class DIContainer {
  private config: ArsenalConfig;

  constructor(config: ArsenalConfig) {
    this.config = config;
  }

  Initialize() {
    // register internal terminal logger
    container.register(Token.LoggerToken.ILogger, {
      useClass: TerminalLogger,
    });

    // register internal ConfigReader
    container.register(Token.ConfigToken.IConfig, {
      useClass: CosmicConfig,
    });

    // register internal PipelineContext
    container.register(Token.ContextToken.IContext, {
      useClass: ChainablePipelineContext,
    });

    //tapable registry
    container.register(Token.PipelineToken.Basic, {
      useFactory: () =>
        new AsyncSeriesHook([Token.ContextToken.PipelineParamCtx]),
    });
    container.register(Token.PipelineToken.Bail, {
      useFactory: () =>
        new AsyncSeriesBailHook([Token.ContextToken.PipelineParamCtx]),
    });
    container.register(Token.PipelineToken.Parallel, {
      useFactory: () =>
        new AsyncParallelHook([Token.ContextToken.PipelineParamCtx]),
    });
  }
}
