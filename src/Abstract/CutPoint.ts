import { IPipelineContext } from "./Context";
import { IPipeline } from "./Pipeline";

export interface ICutPoint<T> {
  /**
   * name of the cut point.
   * it will be used in the registry.
   */
  Name: string;
  /**
   * the pipeline to be cut
   * @param pipeline
   */
  Cut(pipeline: IPipeline<T>): void;

  /**
   * cut point handler
   * @param ctx
   */
  Intercept(ctx: IPipelineContext): Promise<T>;
}
