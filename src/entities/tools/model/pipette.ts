import { RgbColor } from "../../../shared/utils";
import { RootCanvas } from "../../canvas/model/canvas";
import { Renderer } from "./../../renderer/model/renderer";

export interface PipetteMetaInfo {
  imageX: number;
  imageY: number;
  isPrimary: boolean;
}
export interface PipetteToolResult {
  pixelColor: RgbColor;
  metaInfo: PipetteMetaInfo;
}

export type CallbackResult =
  | {
      isCancelled: false;
      result: PipetteToolResult | null;
      preview: Pick<PipetteToolResult, "pixelColor"> & {
        metaInfo: Pick<PipetteMetaInfo, "imageX" | "imageY">;
      };
    }
  | { isCancelled: true; result: null; preview: null };

export type FinishCallback = (result: CallbackResult) => Promise<void>;

export class PipetteTool {
  private callback: (event: MouseEvent) => void;
  private keydownCallback: (event: KeyboardEvent) => void;
  private mousemoveHandler: (event: MouseEvent) => void;
  private finishCallback: FinishCallback;

  private canvas: RootCanvas;
  private renderer: Renderer;

  protected isActive = false;
  private lastPipetteColor: RgbColor | null = null;

  constructor(
    canvas: RootCanvas,
    renderer: Renderer,
    callback: FinishCallback
  ) {
    this.canvas = canvas;
    this.renderer = renderer;

    this.callback = this.handleCanvasClick.bind(this);
    this.keydownCallback = this.onKeydown.bind(this);
    this.mousemoveHandler = this.onMousemove.bind(this);

    document.addEventListener("mousemove", this.mousemoveHandler);
    this.finishCallback = callback;
  }

  public async startTool() {
    await new Promise((resolve) => setTimeout(resolve, 1e2));

    document.addEventListener("click", this.callback);
    document.addEventListener("keydown", this.keydownCallback);

    this.isActive = true;
  }

  private removeAllEventListeners() {
    if (this.callback && this.keydownCallback) {
      document.removeEventListener("click", this.callback);
      document.removeEventListener("keydown", this.keydownCallback);
    } else {
      console.log("You are trying to stop tool which is not started");
    }

    this.isActive = false;
  }

  public stopTool() {
    this.removeAllEventListeners();

    this.finishCallback?.({
      isCancelled: true,
      result: null,
      preview: null,
    });
    return;
  }

  private stopToolSuccessfully(metaInfo: PipetteMetaInfo) {
    this.removeAllEventListeners();

    if (!this.lastPipetteColor) {
      throw new Error("You are dispatching ");
    }
    this.finishCallback?.({
      isCancelled: false,
      result: {
        pixelColor: this.lastPipetteColor,
        metaInfo,
      },
      preview: {
        pixelColor: this.lastPipetteColor,
        metaInfo,
      },
    });
  }

  private onKeydown(event: KeyboardEvent) {
    const isCloseEvent = event.key === "Escape";
    if (isCloseEvent) {
      this.stopTool();
    }
  }

  private onMousemove(event: MouseEvent) {
    const { pageX, pageY } = event;
    const { x: canvasX, y: canvasY } =
      this.canvas.convertWindowCoordinatesToCanvas(pageX, pageY);

    const { x: imageX, y: imageY } =
      this.renderer.convertCanvasCoordinatesToImage(canvasX, canvasY);

    const pixelColor = this.canvas.getPixelColor(canvasX, canvasY);
    this.finishCallback?.({
      isCancelled: false,
      result: null,
      preview: {
        pixelColor: [pixelColor[0], pixelColor[1], pixelColor[2]],
        metaInfo: {
          imageX,
          imageY,
        },
      },
    });
  }

  private handleCanvasClick(event: MouseEvent) {
    const { pageX, pageY } = event;
    const { x: canvasX, y: canvasY } =
      this.canvas.convertWindowCoordinatesToCanvas(pageX, pageY);

    const pixelColor = this.canvas.getPixelColor(canvasX, canvasY);

    this.lastPipetteColor = [pixelColor[0], pixelColor[1], pixelColor[2]];

    const isPrimary = !(
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.metaKey
    );

    const { x: imageX, y: imageY } =
      this.renderer.convertCanvasCoordinatesToImage(canvasX, canvasY);

    this.stopToolSuccessfully({
      imageX,
      imageY,
      isPrimary,
    });
  }
}
