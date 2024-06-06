import { Select } from "antd";
import { FC } from "react";
import css from "./CanvasPanel.module.scss";

const scales = Array.from({ length: 20 }, (_, i) => 12 + i * 10);

interface Props {
  color: string | null;
  coordinates: { x: number; y: number } | null;
  imageSize: { width: number; height: number } | null;
  onScaleChange: (scale: number) => void;
}

export const CanvasPanel: FC<Props> = ({
  color,
  coordinates,
  imageSize,
  onScaleChange,
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
    </div>
  );
};
