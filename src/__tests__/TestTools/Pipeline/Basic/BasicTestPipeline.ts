import { BasicPipeline, injectable } from "../../../..";
import { CutPoint1 } from "./CutPoints/CutPoint1";
import { CutPoint2 } from "./CutPoints/CutPoint2";
import { CutPoint3 } from "./CutPoints/CutPoint3";

@injectable()
export class BasicTestPipeline extends BasicPipeline {
  constructor(
    private cp1: CutPoint1,
    private cp2: CutPoint2,
    private cp3: CutPoint3
  ) {
    super();
    this.Register(cp1);
    this.Register(cp2);
    this.Register(cp3);
  }
}
