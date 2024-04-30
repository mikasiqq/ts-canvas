// ImageCanvas.tsx
import React, { FC, useEffect, useRef, useState } from "react";
import { CanvasPanel } from "./CanvasPanel";

interface Props {
  imageUrl: string;
}

export const ImageCanvas: FC<Props> = ({ imageUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [imageSize, setImageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");

    if (imageUrl) {
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        context?.drawImage(img, 0, 0, img.width, img.height);
        setImageSize({ width: img.width, height: img.height });
      };
    }
  }, [imageUrl]);

  const handleClick = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.getContext) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const imageData = ctx.getImageData(x, y, 1, 1);
      const data = imageData.data;
      setColor(`rgb(${data[0]}, ${data[1]}, ${data[2]})`);
      setCoordinates({ x, y });
    }
  };

  return (
    <>
      <canvas ref={canvasRef} onClick={handleClick} />
      <CanvasPanel
        color={color}
        coordinates={coordinates}
        imageSize={imageSize}
      />
    </>
  );
};
