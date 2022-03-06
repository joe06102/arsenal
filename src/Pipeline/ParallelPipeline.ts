import { container, inject } from "tsyringe";
import { AsyncParallelHook } from "tapable";
import { IContext } from "../Abstract/Context";
import { ParallelCutPoint } from "../Abstract/CutPoint";
import { Pipeline } from "../Abstract/Pipeline";
import { PipelineToken, ContextToken } from "../Constant/Token";

export class ParallelPipeline extends Pipeline<void> {
  private collectCutPoints = container.resolve<AsyncParallelHook<IContext>>(
    PipelineToken.Parallel
  );

  Context: IContext = container.resolve(ContextToken.IContext);

  Register(cutpoint: ParallelCutPoint): void {
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
