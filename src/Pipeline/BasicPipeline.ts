import { container } from "tsyringe";
import { AsyncSeriesHook } from "tapable";
import { PipelineContext } from "../Abstract/Context";
import { ICutPoint } from "../Abstract/CutPoint";
import { IPipeline } from "../Abstract/Pipeline";
import { CutPointType } from "../Constant/CutPoint";

export class BasicPipeline implements IPipeline<void> {
  private collectCutPoints = container.resolve<
    AsyncSeriesHook<PipelineContext>
  >(CutPointType.Basic);

  Context: PipelineContext;

  constructor(userOptions: Record<string, unknown>) {
    this.Context = container.resolve(PipelineContext);
    userOptions && this.Context.Set("options", userOptions);
  }

  Register(cutpoint: ICutPoint<void>): void {
    if (
      cutpoint &&
      typeof cutpoint.Cut === "function" &&
      typeof cutpoint.Intercept === "function"
    ) {
      this.collectCutPoints.tapPromise(cutpoint.Name, cutpoint.Intercept);
    } else {
      throw new TypeError(`expect cutpoint to be valid, but got ${cutpoint}`);
    }
  }
  Run(): void {
    this.collectCutPoints.promise(this.Context);
  }
}
