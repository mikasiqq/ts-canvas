import { FC } from "react";
import css from "./CanvasPanel.module.scss";

interface Props {
  color: string | null;
  coordinates: { x: number; y: number } | null;
  imageSize: { width: number; height: number } | null;
}

export const CanvasPanel: FC<Props> = ({ color, coordinates, imageSize }) => {
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
          <strong>Image Size:</strong>{" "}
          {`${imageSize.width}x${imageSize.height}`}
        </div>
      )}
    </div>
  );
};
