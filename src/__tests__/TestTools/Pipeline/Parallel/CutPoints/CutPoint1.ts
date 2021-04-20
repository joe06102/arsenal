import {
  ParallelCutPoint,
  IContext,
  ILogger,
  inject,
  injectable,
  Token,
} from "../../../../..";

@injectable()
export class CutPoint1 extends ParallelCutPoint {
  Name = CutPoint1.name;

  constructor(@inject(Token.LoggerToken.ILogger) private mockLogger: ILogger) {
    super();
  }

  async Intercept(ctx: IContext): Promise<void> {
    if (!Array.isArray(ctx.Get("order"))) {
      ctx.Set("order", [1]);
    } else {
      ctx.Get<number[]>("order").push(1);
    }

    this.mockLogger.Info("1");
  }
}
