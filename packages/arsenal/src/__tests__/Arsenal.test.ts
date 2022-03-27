import "reflect-metadata";
import { container } from "tsyringe";
import { IContext } from "../abstract/context";
import { ContextToken } from "../constant/token";
import { ChainablePipelineContext } from "../context/chainable-pipeline-context";

beforeAll(() => {
  container.register(ContextToken.IContext, {
    useClass: ChainablePipelineContext,
  });
});

describe("chainable context test suit", () => {
  it('expect ctx.a to be "a"', () => {
    const ctx = container.resolve<IContext>(ContextToken.IContext);
    ctx.Set("a", "a");
    const result = ctx.Get("a");

    expect(result).toBe("a");
  });
});

afterAll(() => {
  container.clearInstances();
});
