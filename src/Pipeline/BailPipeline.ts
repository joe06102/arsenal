import { container } from "tsyringe";
import { AsyncSeriesBailHook } from "tapable";
import { PipelineContext } from "../Abstract/Context";
import { ICutPoint } from "../Abstract/CutPoint";
import { IPipeline } from "../Abstract/Pipeline";
import { CutPointType } from "../Constant/CutPoint";

type BailReturn = Error | void;

export class BailPipeline implements IPipeline<BailReturn> {
  private collectCutPoints = container.resolve<
    AsyncSeriesBailHook<PipelineContext, BailReturn>
  >(CutPointType.Basic);

  Context: PipelineContext;

  constructor(userOptions: Record<string, unknown>) {
    this.Context = container.resolve(PipelineContext);
    userOptions && this.Context.Set("options", userOptions);
  }

  Register(cutpoint: ICutPoint<BailReturn>): void {
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
