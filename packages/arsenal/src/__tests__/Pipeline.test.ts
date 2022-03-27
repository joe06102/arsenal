import "reflect-metadata";
import { container, DependencyContainer } from "tsyringe";
import { createLogger } from "./test-tools/service/logger";
import { BasicTestPipeline } from "./test-tools/pipeline/basic/basic-test-pipeline";
import { BailTestPipeline } from "./test-tools/pipeline/bail/bail-test-pipeline";
import { DIContainer } from "../container";
import { ArsenalConfig } from "../abstract/config";
import { Token } from "..";
import { ParallelTestPipeline } from "./test-tools/pipeline/parallel/parallel-test-pipeline";

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
    const errorHandle = jest.fn(err => {
      console.log('basic pipeline test suit failed: ', err)
    });

    pipeline.Run({}).then(() => {
      const orders = pipeline.Context.Get<number[]>("order");

      expect(mockInfo.mock.calls.length).toBeGreaterThanOrEqual(1);
      expect(orders).toEqual([1, 2, 3]);
    }).catch(errorHandle)
    .finally(() => {
      expect(errorHandle.mock.calls.length).toBe(0)
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
