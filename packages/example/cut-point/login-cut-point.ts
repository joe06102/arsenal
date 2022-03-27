import {
  BasicCutPoint,
  inject,
  injectable,
  ILogger,
  IContext,
  IConfig,
  Token,
} from "jsouee-arsenal";

@injectable()
export class LoginCutPoint extends BasicCutPoint {
  Name = LoginCutPoint.name;

  constructor(
    @inject(Token.LoggerToken.ILogger) private logger: ILogger,
    @inject(Token.ConfigToken.IConfig) private config: IConfig
  ) {
    super();
  }

  async Intercept(ctx: IContext): Promise<void> {
    this.logger.Info(
      `[${LoginCutPoint.name}] ctx: ${ctx.Get(
        "options.name"
      )}, config: ${this.config.Get<string>("entry.name")}`
    );
  }
}
