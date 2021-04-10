import { BasicCutPoint, inject, injectable, ILogger } from "../..";
import { IPipelineContext } from "../../lib/Abstract/Context";
import { IPipeline } from "../../lib/Abstract/Pipeline";

@injectable()
export class LoginCutPoint extends BasicCutPoint {
  Name = LoginCutPoint.name;

  constructor(@inject("ILogger") private logger: ILogger) {
    super();
  }

  Cut(pipeline: IPipeline<void>): void {
    pipeline.Register(this);
  }

  async Intercept(ctx: IPipelineContext): Promise<void> {
    this.logger.Info(`[${LoginCutPoint.name}] ctx: ${ctx.Get("options.name")}`);
  }
}
