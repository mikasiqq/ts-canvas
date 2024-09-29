import {
  Listener,
  MouseChangeStatusHandler,
  MouseMoveHandler,
  MoveInspector,
} from "./types";

const offsetByKey: Record<string, { dx: number; dy: number }> = {
  ArrowRight: { dx: -1, dy: 0 },
  ArrowLeft: { dx: 1, dy: 0 },
  ArrowUp: { dx: 0, dy: 1 },
  ArrowDown: { dx: 0, dy: -1 },
};

export class KeyboardMoveInspector implements MoveInspector {
  private onMoveHandler: MouseMoveHandler | null = null;
  private onChangeStatusHandler: MouseChangeStatusHandler | null = null;

  private onKeydownHandler: Listener<"keydown">;
  private onKeyUpHandler: Listener<"keydown">;

  private moveTickId: any | null = null;
  private curKey: string | null = null;
  private speedCoef = 10;

  constructor() {
    this.onKeydownHandler = this.onKeydown.bind(this);
    this.onKeyUpHandler = this.onKeyup.bind(this);
  }

  public onChangeStatus(onChangeStatus: MouseChangeStatusHandler) {
    this.onChangeStatusHandler = onChangeStatus;
  }

  public onMove(onMove: MouseMoveHandler) {
    this.onMoveHandler = onMove;
  }

  public setSpeedCoef(speedCoef: number) {
    this.speedCoef = speedCoef;
  }

  public inspect() {
    window.addEventListener("keydown", this.onKeydownHandler);
    window.addEventListener("keyup", this.onKeyUpHandler);
  }

  public stop() {
    window.removeEventListener("keydown", this.onKeydownHandler);
    window.removeEventListener("keyup", this.onKeyUpHandler);
  }

  private onKeydown({ key }: KeyboardEvent) {
    if (!(key in offsetByKey) || this.curKey === key) return;
    const { dx, dy } = offsetByKey[key];

    clearInterval(this.moveTickId);

    this.moveTickId = setInterval(() => {
      this.onMoveHandler?.(dx * this.speedCoef, dy * this.speedCoef);
    }, 50);
    this.curKey = key;
  }

  private onKeyup(_: KeyboardEvent) {
    clearInterval(this.moveTickId);
  }
}
