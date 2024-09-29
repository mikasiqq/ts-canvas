import {
  DraggableMoveInspector,
  MouseChangeStatusHandler,
  MoveInspector,
} from "../../../shared/utils/move-insepector";
import { KeyboardMoveInspector } from "../../../shared/utils/move-insepector/keyboard-move-inspector";
import { RootCanvas } from "../../canvas/model";
import { Renderer } from "../../renderer";

export class MoverTool {
  private canvas: RootCanvas;
  private renderer: Renderer;
  private inspectors: MoveInspector[];

  protected isActive = false;

  constructor(canvas: RootCanvas, renderer: Renderer) {
    this.canvas = canvas;
    this.renderer = renderer;

    this.inspectors = [
      new DraggableMoveInspector(),
      new KeyboardMoveInspector(),
    ];
  }

  public startTool(onChangeStatus: MouseChangeStatusHandler) {
    this.isActive = true;
    for (const inspector of this.inspectors) {
      inspector.onChangeStatus(onChangeStatus);
      inspector.onMove(this.onMove.bind(this));
      inspector.inspect();
    }
  }

  public setSpeed(speedCoef: number) {
    for (const inspector of this.inspectors) {
      inspector.setSpeedCoef?.(speedCoef);
    }
  }

  public stopTool() {
    this.isActive = false;
    for (const inspector of this.inspectors) {
      inspector.stop();
    }
  }

  public onMove(dx: number, dy: number) {
    const ALLOW_SPACE = 200;
    const { bottom, left, right, top } = this.canvas.getBoundingClientRect();

    const isInvalidBorder = [
      window.innerWidth - (left + dx) - ALLOW_SPACE,
      window.innerWidth - (window.innerWidth - right - dx) - ALLOW_SPACE,
      window.innerHeight - (top + dy) - ALLOW_SPACE,
      window.innerHeight - (window.innerHeight - bottom - dy) - ALLOW_SPACE,
    ].some((val) => val <= 0);

    if (isInvalidBorder) {
      return;
    }
    this.renderer.moveTo(dx, dy);
  }
}
