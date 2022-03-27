import { container } from "tsyringe";
import { AsyncSeriesBailHook } from "tapable";
import { IContext } from "../abstract/context";
import { BailCutPoint } from "../abstract/cut-point";
import { Pipeline } from "../abstract/pipeline";
import { PipelineToken, ContextToken } from "../constant/token";

type BailReturn = Error | void;

export class BailPipeline extends Pipeline<BailReturn> {
  private collectCutPoints = container.resolve<
    AsyncSeriesBailHook<IContext, BailReturn>
  >(PipelineToken.Bail);

  Context: IContext = container.resolve(ContextToken.IContext);

  Register(cutpoint: BailCutPoint): void {
    if (typeof cutpoint?.Intercept === "function") {
      this.collectCutPoints.tapPromise(
        cutpoint.Name,
        cutpoint.Intercept.bind(cutpoint)
      );
    } else {
      throw new TypeError(`expect cutpoint to be valid, but got ${cutpoint}`);
    }
  }
  Run(userOptions: Record<string, unknown>): Promise<BailReturn> {
    userOptions && this.Context.Set("options", userOptions);
    return this.collectCutPoints.promise(this.Context);
  }
}
