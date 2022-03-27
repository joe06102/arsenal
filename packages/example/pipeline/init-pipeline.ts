import { BasicPipeline, injectable } from "jsouee-arsenal";
import { LoginCutPoint } from "../cut-point/login-cut-point";

@injectable()
export class InitPipeline extends BasicPipeline {
  constructor(private loginCP: LoginCutPoint) {
    super();
    this.Register(loginCP);
  }
}
