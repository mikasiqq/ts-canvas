import { RootCanvas } from "../../canvas/model";
import { DrawableObject } from "../../drawable-object/model/types";

export const PARENT_CONTAINER_ID = "PARENT_CONTAINER_ID";

interface CanvasSize {
  width: number;
  height: number;
}
interface SubscribeContext {
  drawableList: DrawableObject[];
  size: CanvasSize;
  origSize: CanvasSize;
}

export interface Offset {
  dx: number;
  dy: number;
}

export type RendererSubscriber = (context: SubscribeContext) => void;

const GRID_STEP = 30;
export class Renderer {
  private drawableList: DrawableObject[] = [];
  private canvas: RootCanvas;
  private subscriber: RendererSubscriber | null = null;
  private containerId: string;
  private offset: Offset = { dx: 0, dy: 0 };
  private scaleCoef = 1;

  constructor(parentId: string, canvas: RootCanvas) {
    this.canvas = canvas;
    this.containerId = parentId;

    this.render();
  }

  public addDrawable(drawable: DrawableObject) {
    this.drawableList.push(drawable);
    void this.render();
  }

  public getDrawable(index: number) {
    return this.drawableList[index];
  }

  public removeAllDrawable() {
    this.drawableList = [];
    void this.render();
  }

  public getCanvasSize(): CanvasSize {
    return this.getSize(false);
  }

  public getImagesSize(): CanvasSize {
    return this.getSize(true);
  }

  /**
   * Отрисовка происходит след образом: высчитывается размеры элемента - выставляются размеры канваса - отрисовка всех элементов
   */
  public async render() {
    await Promise.resolve();
    const { width, height } = this.getCanvasSize();

    this.canvas.setCanvasSize(width, height);

    const context = this.canvas.getContext();
    for (const drawable of this.drawableList) {
      drawable.draw(0, 0, context);
    }

    this.subscriber?.({
      drawableList: this.drawableList,
      size: this.getCanvasSize(),
      origSize: this.getImagesSize(),
    });
  }

  public async drawGrid() {
    const context = this.canvas.getContext();
    const { width, height } = this.getCanvasSize();

    context.strokeStyle = "lightgray";
    for (let i = 0; i < width; i += GRID_STEP) {
      context.moveTo(i, 0);
      context.lineTo(i, height);
      context.stroke();
    }

    for (let i = 0; i < height; i += GRID_STEP) {
      context.moveTo(0, i);
      context.lineTo(width, i);
      context.stroke();
    }
  }
  public scale(scale: number) {
    this.scaleCoef = scale;

    for (const drawable of this.drawableList) {
      drawable.scale(scale, scale);
    }
    this.render();
  }

  public convertCanvasCoordinatesToImage(x: number, y: number) {
    return {
      x: Math.floor(x / this.scaleCoef),
      y: Math.floor(y / this.scaleCoef),
    };
  }

  public resize(scaleX: number, scaleY: number) {
    for (const drawable of this.drawableList) {
      drawable.resize(scaleX, scaleY);
    }
    this.render();
  }

  public getScaleCanvasToFullWidthImage(): number {
    const { width } = this.getCanvasSize();

    const targetWidth = window.innerWidth - 50 * 2;
    const scale = targetWidth / width;

    return +scale.toFixed(2);
  }

  public subscribe(subscriber: RendererSubscriber) {
    this.subscriber = subscriber;
  }

  private getSize(original: boolean) {
    let maxWidth = 0;
    let maxHeight = 0;

    for (const drawable of this.drawableList) {
      const { width, height } = original
        ? drawable.getOriginalSize()
        : drawable.getSize();
      maxHeight = Math.max(maxHeight, height);
      maxWidth = Math.max(maxWidth, width);
    }

    return {
      width: maxWidth,
      height: maxHeight,
    };
  }

  public moveTo(dx: number, dy: number) {
    const containerElement = document.getElementById(this.containerId);

    if (!containerElement) {
      throw new Error(
        "containerElement does not exist for adding event listener"
      );
    }

    this.offset.dx = this.offset.dx + dx;
    this.offset.dy = this.offset.dy + dy;

    containerElement.style.transform = `translate(${this.offset.dx}px, ${this.offset.dy}px)`;
  }
}
