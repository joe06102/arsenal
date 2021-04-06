import { PipelineContext } from "./Context";
import { ICutPoint } from "./CutPoint";

export interface IPipeline<CutPointReturn> {
  /**
   * pipeline scoped context
   */
  Context: PipelineContext;

  /**
   * register cut point to the pipeline
   * @param cutpoint
   */
  Register(cutpoint: ICutPoint<CutPointReturn>): void;

  /**
   * start the pipeline
   */
  Run(): void;
}

export interface IPipelineConstructor<CutPointReturn> {
  new (options: Record<string, unknown>): IPipeline<CutPointReturn>;
}
