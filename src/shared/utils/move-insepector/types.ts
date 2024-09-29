export type MouseChangeStatusHandler = (status: "start" | "end") => void;

export type MouseMoveHandler = (dx: number, dy: number) => void;

export interface MoveInspector {
  onChangeStatus(handle: MouseChangeStatusHandler): void;
  onMove(handle: MouseMoveHandler): void;
  inspect(): void;
  stop(): void;
  setSpeedCoef?(coef: number): void;
}

export type Listener<K extends keyof DocumentEventMap> = (
  event: DocumentEventMap[K]
) => void;
