import { IPipelineContext } from "../Abstract/Context";
import { ICutPoint } from "../Abstract/CutPoint";

type BailReturn = Error | undefined;

/**
 * template instantiation
 */

export abstract class BasicCutPoint implements ICutPoint<void> {
  abstract Name: string;
  abstract Intercept(ctx: IPipelineContext): Promise<void>;
}

export abstract class BailCutPoint implements ICutPoint<BailReturn> {
  abstract Name: string;
  abstract Intercept(ctx: IPipelineContext): Promise<BailReturn>;
}

export abstract class ParallelCutPoint implements ICutPoint<void> {
  abstract Name: string;
  abstract Intercept(ctx: IPipelineContext): Promise<void>;
}
