import {
  BasicCutPoint,
  inject,
  injectable,
  ILogger,
  IConfig,
  Token,
} from "../..";
import { IPipelineContext } from "../../lib/Abstract/Context";

@injectable()
export class LoginCutPoint extends BasicCutPoint {
  Name = LoginCutPoint.name;

  constructor(
    @inject(Token.LoggerToken.ILogger) private logger: ILogger,
    @inject(Token.ConfigToken.IConfig) private config: IConfig
  ) {
    super();
  }

  async Intercept(ctx: IPipelineContext): Promise<void> {
    this.logger.Info(
      `[${LoginCutPoint.name}] ctx: ${ctx.Get(
        "options.name"
      )}, config: ${this.config.Get<string>("entry.name")}`
    );
  }
}
