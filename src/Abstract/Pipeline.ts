import { IContext } from "./Context";
import { ICutPoint } from "./CutPoint";

export abstract class Pipeline<CutPointReturn> {
  /**
   * pipeline scoped context
   */
  abstract Context: IContext;

  /**
   * register cut point to the pipeline
   * @param cutpoint
   */
  abstract Register(cutpoint: ICutPoint<CutPointReturn>): void;

  /**
   * start the pipeline
   */
  abstract Run(userOptions: Record<string, unknown>): Promise<CutPointReturn>;
}

export interface IPipelineConstructor<CutPointReturn> {
  new (options: Record<string, unknown>): Pipeline<CutPointReturn>;
}
