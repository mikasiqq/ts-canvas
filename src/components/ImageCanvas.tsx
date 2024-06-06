import { observer } from "mobx-react-lite";
import React, { FC, useEffect, useRef } from "react";
import imageCanvasStore from "../stores/image-canvas-store";
import imageSettingsStore from "../stores/image-settings-store";
import { CanvasPanel } from "./CanvasPanel";
import css from "./ImageCanvas.module.scss";

interface Props {
  imageUrl: string;
}

export const ImageCanvas: FC<Props> = observer(({ imageUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { color, coordinates, setColor, setCoordinates } = imageCanvasStore;
  const {
    scale,
    setScale,
    imageSize,
    setImageSize,
    formattedSize,
    measurement,
    isAspectRatio,
  } = imageSettingsStore;

  const drawImage = (
    size: { width: number; height: number },
    canvas: HTMLCanvasElement,
    img: HTMLImageElement,
    context?: CanvasRenderingContext2D | null
  ) => {
    canvas.width = size.width;
    canvas.height = size.height;
    context?.drawImage(img, 0, 0, size.width, size.height);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");

    if (imageUrl) {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = imageUrl;

      img.onload = () => {
        if (imageSize) {
          if (isAspectRatio) {
            drawImage(
              {
                width: (img.width * imageSize.width) / imageSize.height,
                height: img.height,
              },
              canvas,
              img,
              context
            );
          } else if (measurement === "pixels") {
            drawImage(
              {
                width: (imageSize.width * scale) / 100,
                height: (imageSize.height * scale) / 100,
              },
              canvas,
              img,
              context
            );
          } else {
            drawImage(
              {
                width: (img.width * imageSize.width) / 100,
                height: (img.height * imageSize.height) / 100,
              },
              canvas,
              img,
              context
            );
          }
        } else {
          const width = (img.width * scale) / 100;
          const height = (img.height * scale) / 100;

          drawImage(
            {
              width,
              height,
            },
            canvas,
            img,
            context
          );
          canvas.width = width;
          canvas.height = height;
          context?.drawImage(img, 0, 0, width, height);

          setImageSize({ width, height }, "pixels");
        }
      };
    }
  }, [imageSize, imageUrl, isAspectRatio, measurement, scale, setImageSize]);

  const handleClick = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.getContext) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const imageData = ctx.getImageData(x, y, 1, 1);
    const data = imageData.data;
    setColor(`rgb(${data[0]}, ${data[1]}, ${data[2]})`);
    setCoordinates({ x, y });
  };

  return (
    <div className={css.container}>
      <canvas ref={canvasRef} onClick={handleClick} />
      <CanvasPanel
        color={color}
        coordinates={coordinates}
        imageSize={formattedSize}
        onScaleChange={setScale}
      />
    </div>
  );
});
