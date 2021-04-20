import "reflect-metadata";
import { container, DependencyContainer } from "tsyringe";
import { createLogger } from "./TestTools/Service/Logger";
import { BasicTestPipeline } from "./TestTools/Pipeline/Basic/BasicTestPipeline";
import { BailTestPipeline } from "./TestTools/Pipeline/Bail/BailTestPipeline";
import { DIContainer } from "../DIContainer";
import { ArsenalConfig } from "../Abstract/Config";
import { Token } from "..";
import { ParallelTestPipeline } from "./TestTools/Pipeline/Parallel/ParallelTestPipeline";

let childContainer: DependencyContainer;

beforeAll(() => {
  const arsenalContainer = new DIContainer(new ArsenalConfig());
  arsenalContainer.Initialize();
  childContainer = container.createChildContainer();
});

describe("basic pipeline test suit", () => {
  it("expect ctx.order to be [1,2,3]", () => {
    const mockInfo = jest.fn();
    const MockLogger = createLogger({
      Info: mockInfo,
      Success: jest.fn(),
      Error: jest.fn(),
      Warning: jest.fn(),
    });
    childContainer.register(Token.LoggerToken.ILogger, {
      useClass: MockLogger,
    });
    const pipeline = childContainer.resolve<BasicTestPipeline>(
      BasicTestPipeline
    );

    pipeline.Run({}).then(() => {
      const orders = pipeline.Context.Get<number[]>("order");

      expect(mockInfo.mock.calls.length).toBeGreaterThanOrEqual(1);
      expect(orders).toEqual([1, 2, 3]);
    });
  });
});

describe("bail pipeline test suit", () => {
  it("expect ctx.order to be [1]", () => {
    const mockInfo = jest.fn();
    const MockLogger = createLogger({
      Info: mockInfo,
      Success: jest.fn(),
      Error: jest.fn(),
      Warning: jest.fn(),
    });
    childContainer.register(Token.LoggerToken.ILogger, {
      useClass: MockLogger,
    });
    const pipeline = childContainer.resolve<BailTestPipeline>(BailTestPipeline);
    const successHandle = jest.fn();
    pipeline
      .Run({})
      .then(successHandle)
      .catch((err) => {
        const orders = pipeline.Context.Get<number[]>("order");

        expect(mockInfo.mock.calls.length).toBe(1);
        expect(orders).toEqual([1]);
        expect(err).toBeInstanceOf(Error);
        expect(successHandle.mock.calls.length).toBe(0);
      });
  });
});

describe("parallel pipeline test suit", () => {
  it("expect ctx.order to be [1]", () => {
    const mockInfo = jest.fn();
    const MockLogger = createLogger({
      Info: mockInfo,
      Success: jest.fn(),
      Error: jest.fn(),
      Warning: jest.fn(),
    });
    childContainer.register(Token.LoggerToken.ILogger, {
      useClass: MockLogger,
    });
    const pipeline = childContainer.resolve<ParallelTestPipeline>(
      ParallelTestPipeline
    );
    const errorHandle = jest.fn();
    pipeline
      .Run({})
      .then((result: unknown) => {
        const orders = pipeline.Context.Get<number[]>("order");

        expect(mockInfo.mock.calls.length).toBe(1);
        expect(orders).toEqual([1, 2, 3]);
        expect(result).toBeUndefined();
      })
      .catch(errorHandle)
      .finally(() => {
        expect(errorHandle.mock.calls.length).toBe(0);
      });
  });
});

afterAll(() => {
  childContainer.reset();
  container.clearInstances();
});
