import { BailPipeline, injectable } from "../../../..";
import { CutPoint1 } from "./cut-points/cut-point-1";
import { CutPoint2 } from "./cut-points/cut-point-2";
import { CutPoint3 } from "./cut-points/cut-point-3";

@injectable()
export class BailTestPipeline extends BailPipeline {
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
