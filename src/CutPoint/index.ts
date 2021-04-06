import { PipelineContext } from "../Abstract/Context";
import { ICutPoint } from "../Abstract/CutPoint";
import { IPipeline } from "../Abstract/Pipeline";

type BailReturn = Error | undefined;

/**
 * template instantiation
 */

export abstract class BasicCutPoint implements ICutPoint<void> {
  abstract Name: string;
  abstract Cut(pipeline: IPipeline<void>): void;
  abstract Intercept(ctx: PipelineContext): Promise<void>;
}

export abstract class BailCutPoint implements ICutPoint<BailReturn> {
  abstract Name: string;
  abstract Cut(pipeline: IPipeline<BailReturn>): void;
  abstract Intercept(ctx: PipelineContext): Promise<BailReturn>;
}

export abstract class ParallelCutPoint implements ICutPoint<void> {
  abstract Name: string;
  abstract Cut(pipeline: IPipeline<void>): void;
  abstract Intercept(ctx: PipelineContext): Promise<void>;
}
