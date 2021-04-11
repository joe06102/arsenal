import { container, inject } from "tsyringe";
import { AsyncSeriesHook } from "tapable";
import { IPipelineContext } from "../Abstract/Context";
import { ICutPoint } from "../Abstract/CutPoint";
import { IPipeline } from "../Abstract/Pipeline";
import { CutPointToken } from "../Constant/Token";

export class BasicPipeline implements IPipeline<void> {
  private collectCutPoints = container.resolve<
    AsyncSeriesHook<IPipelineContext>
  >(CutPointToken.Basic);

  Context: IPipelineContext = container.resolve("IPipelineContext");

  Register(cutpoint: ICutPoint<void>): void {
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
