import { IContext } from "../Abstract/Context";

type BailReturn = Error | undefined;

export interface ICutPoint<T> {
  /**
   * name of the cut point.
   * it will be used in the registry.
   */
  Name: string;

  /**
   * cut point handler
   * @param ctx
   */
  Intercept(ctx: IContext): Promise<T>;
}

/**
 * template instantiation
 */
export abstract class BasicCutPoint implements ICutPoint<void> {
  abstract Name: string;
  abstract Intercept(ctx: IContext): Promise<void>;
}

export abstract class BailCutPoint implements ICutPoint<BailReturn> {
  abstract Name: string;
  abstract Intercept(ctx: IContext): Promise<BailReturn>;
}

export abstract class ParallelCutPoint implements ICutPoint<void> {
  abstract Name: string;
  abstract Intercept(ctx: IContext): Promise<void>;
}
