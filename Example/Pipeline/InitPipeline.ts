import { BasicPipeline, injectable } from "../..";
import { LoginCutPoint } from "../CutPoint/LoginCutPoint";

@injectable()
export class InitPipeline extends BasicPipeline {
  constructor(private loginCP: LoginCutPoint) {
    super();
    this.Register(loginCP);
  }
}
