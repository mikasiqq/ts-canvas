import _ from "lodash";
/**
 * Клас
 */

export type CanvasSubscriber = (result: { x: number; y: number }) => void;
export class RootCanvas {
  private root: HTMLCanvasElement;
  private subcriber: CanvasSubscriber | null = null;

  constructor(id: string) {
    const canvasRoot = document.getElementById(id);

    if (!canvasRoot) {
      throw new Error("Root for canvas does not exists");
    }

    const isCanvas = canvasRoot instanceof HTMLCanvasElement;
    if (!isCanvas) {
      throw new Error("Root for canvas does not instance of canvas");
    }

    this.root = canvasRoot;

    const callback = _.throttle(this.detectMouseEvent.bind(this), 50);
    document.addEventListener("mousemove", callback);
  }

  public getContext() {
    const context = this.root.getContext("2d");
    if (!context) {
      throw new Error("Context is not exist for canvas root element");
    }
    return context;
  }

  public getRoot() {
    return this.root;
  }

  public getCanvasImageData() {
    const context = this.getContext();

    return context.getImageData(
      0,
      0,
      context.canvas.width,
      context.canvas.height
    );
  }

  public setCanvasSize(width: number, height: number) {
    this.root.width = width;
    this.root.height = height;
  }

  public getPixelColor(x: number, y: number) {
    return this.getContext().getImageData(x, y, 1, 1).data;
  }

  public subscribeToChange(subscriber: CanvasSubscriber) {
    this.subcriber = subscriber;
  }

  public getBoundingClientRect() {
    return this.root.getBoundingClientRect();
  }

  public convertWindowCoordinatesToCanvas(x: number, y: number) {
    const { x: canvasDx, y: canvasDy } = this.root.getBoundingClientRect();

    return {
      x: this.root.width < x - canvasDx ? -1 : x - canvasDx,
      y: this.root.height < y - canvasDy ? -1 : y - canvasDy,
    };
  }

  private detectMouseEvent(event: MouseEvent) {
    const coordinates = this.convertWindowCoordinatesToCanvas(
      event.pageX,
      event.pageY
    );

    this.subcriber?.(coordinates);
  }
}
