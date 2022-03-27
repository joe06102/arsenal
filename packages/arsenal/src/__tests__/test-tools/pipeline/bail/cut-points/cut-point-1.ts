import {
  BailCutPoint,
  BailReturn,
  IContext,
  ILogger,
  inject,
  injectable,
  Token,
} from "../../../../..";

@injectable()
export class CutPoint1 extends BailCutPoint {
  Name = CutPoint1.name;

  constructor(@inject(Token.LoggerToken.ILogger) private mockLogger: ILogger) {
    super();
  }

  async Intercept(ctx: IContext): Promise<BailReturn> {
    if (!Array.isArray(ctx.Get("order"))) {
      ctx.Set("order", [1]);
    } else {
      ctx.Get<number[]>("order").push(1);
    }

    this.mockLogger.Info("1");
    return new Error("cutpoint 1 error");
  }
}
