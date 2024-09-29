export interface DrawableSize {
  width: number;
  height: number;
}

export interface DrawableObject {
  draw(
    x: number,
    y: number,
    context: CanvasRenderingContext2D
  ): void | Promise<void>;
  getSize(): DrawableSize;
  getOriginalSize(): DrawableSize;
  resize(scaleX: number, scaleY: number): void;
  scale(scaleX: number, scaleY: number): void;

  getData(): Promise<ImageData>; // TODO: улучшить
}
