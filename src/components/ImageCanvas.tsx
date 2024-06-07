import { observer } from "mobx-react-lite";
import React, { FC, useEffect, useRef, useState } from "react";
import imageCanvasStore from "../stores/image-canvas-store";
import imageSettingsStore from "../stores/image-settings-store";
import { Nullable } from "../types";
import { CanvasPanel } from "./CanvasPanel";
import css from "./ImageCanvas.module.scss";

interface Props {
  imageUrl: string;
}

export const ImageCanvas: FC<Props> = observer(({ imageUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState<number>(10);
  const [startY, setStartY] = useState<number>(10);
  const [operation, setOperation] = useState<"picker" | "hand">("picker");
  const [imageObj, setImageObj] = useState<{
    image?: HTMLImageElement;
    xposition?: number;
    yposition?: number;
  }>({});
  const [secondColor, setSecondColor] = useState<Nullable<string>>(null);
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
            setImageObj({ image: img });
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

  const handleMouseUp = () => {
    setIsDragging(false);
    setStartX(0);
    setStartY(0);
  };

  const handleClick = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (operation === "hand") return;

    const canvas = canvasRef.current;
    if (!canvas || !canvas.getContext) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const imageData = ctx.getImageData(x, y, 1, 1);
    const data = imageData.data;
    if (!event.altKey) {
      setColor(`rgb(${data[0]}, ${data[1]}, ${data[2]})`);
    } else {
      setSecondColor(`rgb(${data[0]}, ${data[1]}, ${data[2]})`);
    }
    setCoordinates({ x, y });
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const dx = event.clientX - rect.left - startX + (imageObj.xposition || 0);
      const dy = event.clientY - rect.top - startY + (imageObj.yposition || 0);

      setImageObj((prev) => ({
        ...prev,
        xposition: dx,
        yposition: dy,
      }));

      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      if (imageObj.image) {
        ctx?.drawImage(
          imageObj.image,
          dx,
          dy,
          imageSize?.width || 0,
          imageSize?.height || 0
        );
      }
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (operation === "picker") return;

      setIsDragging(true);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      setStartX(event.clientX - rect.left);
      setStartY(event.clientY - rect.top);
    };

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    imageObj.image,
    imageObj.xposition,
    imageObj.yposition,
    imageSize?.height,
    imageSize?.width,
    isDragging,
    operation,
    startX,
    startY,
  ]);

  return (
    <div className={css.container}>
      <canvas ref={canvasRef} onClick={handleClick} />
      <CanvasPanel
        operation={operation}
        color={color}
        secondColor={secondColor}
        coordinates={coordinates}
        imageSize={formattedSize}
        onScaleChange={setScale}
        onChange={setOperation}
      />
    </div>
  );
});
