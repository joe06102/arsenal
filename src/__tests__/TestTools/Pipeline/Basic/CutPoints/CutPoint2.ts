import {
  BasicCutPoint,
  IContext,
  ILogger,
  inject,
  injectable,
  Token,
} from "../../../../..";

@injectable()
export class CutPoint2 extends BasicCutPoint {
  Name = CutPoint2.name;

  constructor(@inject(Token.LoggerToken.ILogger) private mockLogger: ILogger) {
    super();
  }

  async Intercept(ctx: IContext): Promise<void> {
    if (!Array.isArray(ctx.Get("order"))) {
      ctx.Set("order", [2]);
    } else {
      ctx.Get<number[]>("order").push(2);
    }
    this.mockLogger.Info("2");
  }
}
