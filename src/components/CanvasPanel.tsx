import { Button, Select, Tooltip } from "antd";
import { FC } from "react";
import css from "./CanvasPanel.module.scss";

const scales = Array.from({ length: 20 }, (_, i) => 12 + i * 10);

interface Props {
  color: string | null;
  secondColor: string | null;
  coordinates: { x: number; y: number } | null;
  imageSize: { width: number; height: number } | null;
  operation: "picker" | "hand";
  onScaleChange: (scale: number) => void;
  onChange: (value: "picker" | "hand") => void;
}

export const CanvasPanel: FC<Props> = ({
  color,
  coordinates,
  imageSize,
  operation,
  secondColor,
  onScaleChange,
  onChange,
}) => {
  return (
    <div className={css.panel}>
      {color && (
        <div className={css.color}>
          <strong>Color:</strong>
          <div className={css.colorInfo} style={{ backgroundColor: color }} />
        </div>
      )}
      {coordinates && (
        <div>
          <strong>Coordinates:</strong> {`(${coordinates.x}, ${coordinates.y})`}
        </div>
      )}
      {imageSize && (
        <div>
          <strong>Image Size:</strong>
          {`${imageSize.width}x${imageSize.height}`}
        </div>
      )}
      <div>
        <strong>Scale:</strong>
        <Select
          defaultValue={100}
          style={{ width: 120 }}
          onChange={onScaleChange}
        >
          {scales.map((scale) => (
            <Select.Option key={scale} value={scale}>
              {scale}%
            </Select.Option>
          ))}
        </Select>
      </div>
      <div style={{ marginTop: 10 }}>
        <Tooltip
          trigger={"hover"}
          title={`First color - ${color || "отсутсвует"}, second color - ${
            secondColor || "отсутсвует"
          }`}
        >
          <Button
            className={operation === "picker" ? css.active : undefined}
            onClick={() => onChange("picker")}
          >
            Picker
          </Button>
        </Tooltip>
        <Button
          className={operation === "hand" ? css.active : undefined}
          onClick={() => onChange("hand")}
        >
          Hand
        </Button>
      </div>
    </div>
  );
};
