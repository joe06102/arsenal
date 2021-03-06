import { container, inject } from "tsyringe";
import { AsyncSeriesHook } from "tapable";
import { IContext } from "../abstract/context";
import { BasicCutPoint } from "../abstract/cut-point";
import { Pipeline } from "../abstract/pipeline";
import { PipelineToken, ContextToken } from "../constant/token";

export class BasicPipeline extends Pipeline<void> {
  private collectCutPoints = container.resolve<AsyncSeriesHook<IContext>>(
    PipelineToken.Basic
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
  Run(userOptions: Record<string, unknown>): Promise<void> {
    userOptions && this.Context.Set("options", userOptions);
    return this.collectCutPoints.promise(this.Context);
  }
}
