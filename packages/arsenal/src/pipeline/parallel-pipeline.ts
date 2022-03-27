import { container, inject } from "tsyringe";
import { AsyncParallelHook } from "tapable";
import { IContext } from "../abstract/context";
import { ParallelCutPoint } from "../abstract/cut-point";
import { Pipeline } from "../abstract/pipeline";
import { PipelineToken, ContextToken } from "../constant/token";

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
