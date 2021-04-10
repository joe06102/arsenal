import { container, inject } from "tsyringe";
import { AsyncParallelHook } from "tapable";
import { IPipelineContext } from "../Abstract/Context";
import { ICutPoint } from "../Abstract/CutPoint";
import { IPipeline } from "../Abstract/Pipeline";
import { CutPointType } from "../Constant/CutPoint";

export class ParallelPipeline implements IPipeline<void> {
  private collectCutPoints = container.resolve<
    AsyncParallelHook<IPipelineContext>
  >(CutPointType.Basic);

  Context: IPipelineContext = container.resolve("IPipelineContext");

  Register(cutpoint: ICutPoint<void>): void {
    if (
      cutpoint &&
      typeof cutpoint.Cut === "function" &&
      typeof cutpoint.Intercept === "function"
    ) {
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
