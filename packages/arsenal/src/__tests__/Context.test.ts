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
  it("expect all values to be resolved", () => {
    const ctx = container.resolve<IContext>(ContextToken.IContext);
    ctx.Set("a", "a");
    expect(ctx.Get("a")).toBe("a");

    ctx.Set("a", { b: "a.b" });
    expect(ctx.Get("a.b")).toBe("a.b");
    expect(ctx.Get(`[a].b`)).toBe("a.b");
    expect(ctx.Get(`[a][b]`)).toBe("a.b");

    const symbolKey = Symbol("id");
    ctx.Set(symbolKey, "a");
    expect(ctx.Get(symbolKey)).toBe("a");
  });

  it("expect all value to be undefined & no error throws", () => {
    const ctx = container.resolve<IContext>(ContextToken.IContext);

    expect(ctx.Get("a")).toBeUndefined();
    expect(ctx.Get("a.b")).toBeUndefined();
    expect(ctx.Get(`[a].b`)).toBeUndefined();
  });

  it("expect error to throw when setting nest props", () => {
    const ctx = container.resolve<IContext>(ContextToken.IContext);

    expect(() => ctx.Set("a.b", 1)).toThrow();
    expect(() => ctx.Set(`[a].b`, 2)).toThrow();
  });
});

afterAll(() => {
  container.clearInstances();
});
