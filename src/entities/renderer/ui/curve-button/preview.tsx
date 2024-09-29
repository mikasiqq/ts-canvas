import { useEffect, useRef } from "react";
import { RootCanvas } from "../../../canvas/model";
import { Renderer } from "../../model";
import { DrawableImage } from "../../../drawable-object/model/drawable-image";

interface PreviewProps {
  drawableData: ImageData;
}

export const Preview = ({ drawableData }: PreviewProps) => {
  const canvas = useRef<RootCanvas>();
  const renderer = useRef<Renderer>();

  const initCanvasData = async (drawableData: ImageData) => {
    if (!renderer.current) return;

    renderer.current.removeAllDrawable();
    const blob = new Blob([drawableData.data], {
      type: "application/octet-stream",
    });
    const image = new DrawableImage(blob, drawableData);

    renderer.current.addDrawable(image);
    await renderer.current.render();
  };

  useEffect(() => {
    canvas.current = new RootCanvas("curve_preview_canvas");
    renderer.current = new Renderer("curve_preview_container", canvas.current);
  }, []);

  useEffect(() => {
    if (!renderer.current || !canvas.current) return;
    initCanvasData(drawableData);
  }, [initCanvasData, drawableData, canvas, renderer]);
  return (
    <div
      id="curve_preview_container"
      style={{ width: "400px", height: "400px", display: "flex" }}
    >
      <canvas
        id="curve_preview_canvas"
        style={{ width: "100%", height: "100%" }}
      ></canvas>
    </div>
  );
};
