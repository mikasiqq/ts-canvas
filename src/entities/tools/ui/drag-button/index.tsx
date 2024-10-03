import { Button, InputNumber, Tooltip } from "antd";
import React, { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import { MouseChangeStatusHandler } from "../../../../shared/utils/move-insepector";
import {
  setActiveTool,
  setSpeedCoef,
  startMover,
  stopMover,
} from "../../model";

export const DragButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const isCanvasEmpty = useAppSelector(
    (state) => state.canvasSlice.isCanvasEmpty
  );
  const activeTool = useAppSelector(
    (store) => store.toolSlice.activeTool?.name
  );
  const isDragAction = useMemo(() => activeTool === "mover", [activeTool]);

  const dragSpeed = useAppSelector((state) => state.toolSlice.dragSpeedCoef);

  const onMoveAction: MouseChangeStatusHandler = (status) => {
    dispatch(
      setActiveTool({
        name: "mover",
        state: status === "start" ? "grabbing" : "wait",
      })
    );
  };

  const onSpeedChange = (value: number | null) => {
    if (!value) return;
    dispatch(setSpeedCoef(value));
  };

  const handleButtonClick = useCallback(() => {
    if (activeTool === "mover") {
      dispatch(stopMover());
      return;
    }
    dispatch(
      setActiveTool({
        name: "mover",
        state: "wait",
      })
    );
    dispatch(startMover(onMoveAction));
  }, [activeTool, dispatch, onMoveAction]);

  return (
    <div style={{ display: "flex", gap: "16px" }}>
      <Tooltip title="Перемещаться внутри изображения">
        <Button
          shape="round"
          onClick={handleButtonClick}
          disabled={isCanvasEmpty}
          type={isDragAction ? "primary" : "dashed"}
        >
          Рука
        </Button>
      </Tooltip>
      {isDragAction && (
        <InputNumber
          title="Скорость"
          value={dragSpeed}
          onChange={onSpeedChange}
        />
      )}
    </div>
  );
};
