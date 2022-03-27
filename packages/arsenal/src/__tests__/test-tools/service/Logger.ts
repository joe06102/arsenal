import { ILogger } from "../../../abstract/logger";

export function createLogger(impl: ILogger): any {
  class MockLogger implements ILogger {
    Info = impl.Info;
    Success = impl.Success;
    Error = impl.Error;
    Warning = impl.Warning;
  }

  return MockLogger;
}
