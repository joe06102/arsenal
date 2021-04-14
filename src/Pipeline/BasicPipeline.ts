import { container, inject } from "tsyringe";
import { AsyncSeriesHook } from "tapable";
import { IContext } from "../Abstract/Context";
import { BasicCutPoint } from "../Abstract/CutPoint";
import { Pipeline } from "../Abstract/Pipeline";
import { CutPointToken, ContextToken } from "../Constant/Token";

export class BasicPipeline extends Pipeline<void> {
  private collectCutPoints = container.resolve<AsyncSeriesHook<IContext>>(
    CutPointToken.Basic
  );

  Context: IContext = container.resolve(ContextToken.IContext);

  Register(cutpoint: BasicCutPoint): void {
    if (typeof cutpoint?.Intercept === "function") {
      this.collectCutPoints.tapPromise(
        cutpoint.Name,
        cutpoint.Intercept.bind(cutpoint)
      );
    } else {
      throw new TypeError(`expect cutpoint to be valid, but got ${cutpoint}`);
    }
  }
  Run(userOptions: Record<string, unknown>): void {
    userOptions && this.Context.Set("options", userOptions);
    this.collectCutPoints.promise(this.Context);
  }
}
