import {
  ParallelCutPoint,
  IContext,
  ILogger,
  inject,
  injectable,
  Token,
} from "../../../../..";

@injectable()
export class CutPoint3 extends ParallelCutPoint {
  Name = CutPoint3.name;

  constructor(@inject(Token.LoggerToken.ILogger) private mockLogger: ILogger) {
    super();
  }

  async Intercept(ctx: IContext): Promise<void> {
    if (!Array.isArray(ctx.Get("order"))) {
      ctx.Set("order", [3]);
    } else {
      ctx.Get<number[]>("order").push(3);
    }
    this.mockLogger.Info("3");
  }
}
