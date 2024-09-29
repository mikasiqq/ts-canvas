import { nearestNeighbourImpl } from "../../../shared/utils";
import { DrawableObject } from "./types";

export class DrawableImage implements DrawableObject {
  private imageFile: File | Blob;
  private imageData: ImageData | null = null;
  private origImageData: ImageData | null = null;
  private loadedImage: HTMLImageElement | null = null;

  private scalePair: [number, number] = [100, 100];

  constructor(file: File | Blob, imageData?: ImageData) {
    this.imageFile = file;
    this.imageData = imageData ?? null;
    this.origImageData = imageData ?? null;
  }

  public async init() {
    const imageData = await this.getData();
    this.origImageData = imageData;
    this.imageData = imageData;
  }

  public static async fromUrl(url: string): Promise<DrawableImage> {
    const result = await fetch(url);

    if (!result.ok) {
      throw new Error("Result is not ok");
    }
    const buffers = await result.arrayBuffer();

    const blob = new Blob([buffers], {
      type: "application/octet-stream",
    });

    return new DrawableImage(blob);
  }

  public async draw(
    x: number,
    y: number,
    context: CanvasRenderingContext2D
  ): Promise<void> {
    if (!this.imageData) throw new Error("123");

    context.putImageData(this.imageData, x, y);
  }

  /**
   * ImageData can be scaled by `resize` method with , so `getSize` will return current image size depends on scale
   */
  public getSize() {
    if (!this.imageData) throw new Error("");
    const { width, height } = this.imageData;

    return {
      width,
      height,
    };
  }

  /**
   *
   */
  public getOriginalSize() {
    if (!this.origImageData) throw new Error("");

    const { width, height } = this.origImageData;

    return {
      width,
      height,
    };
  }

  public scale(scaleX: number, scaleY: number): void {
    if (!this.origImageData) {
      throw new Error(
        "Before getting resizable image you should set image data"
      );
    }

    this.imageData = this.getResizedImageData(
      this.origImageData,
      scaleX,
      scaleY
    );

    this.scalePair = [scaleX, scaleY];
  }

  public resize(scaleX: number, scaleY: number): void {
    if (!this.origImageData) {
      throw new Error(
        "Before getting resizable image you should set image data"
      );
    }

    this.origImageData = this.getResizedImageData(
      this.origImageData,
      scaleX,
      scaleY
    );

    this.imageData = this.getResizedImageData(
      this.origImageData,
      this.scalePair[0],
      this.scalePair[1]
    );
  }

  public async getData(): Promise<ImageData> {
    if (this.imageData) return this.imageData;

    if (!this.loadedImage) {
      this.loadedImage = await this.loadImage();
    }
    const context = this.createTemporaryCanvas(
      this.loadedImage.width,
      this.loadedImage.height
    );
    context.drawImage(this.loadedImage, 0, 0);

    this.imageData = context.getImageData(
      0,
      0,
      this.loadedImage.width,
      this.loadedImage.height
    );
    return this.imageData;
  }

  private getResizedImageData(
    imageData: ImageData,
    scaleX: number,
    scaleY: number
  ): ImageData {
    const {
      data,
      width: currentImageDataWidth,
      height: currentImageDataHeight,
    } = imageData;

    console.time("groupped_image");
    const grouppedImageData: number[][] = [];
    for (let i = 0; i < data.length; i += 4) {
      const rowIndex = Math.floor(i / 4 / currentImageDataWidth);
      const groupIndex = Math.floor(i / 4) % currentImageDataWidth;
      if (!grouppedImageData[rowIndex]) grouppedImageData[rowIndex] = [];

      /**
       * We use index of original image for increasing speed of working
       * This way is not valid if resize algorithm can generate own value
       */
      grouppedImageData[rowIndex][groupIndex] = i;
    }

    console.timeEnd("groupped_image");

    console.time("getting_resized_img");
    const resizedImageData = nearestNeighbourImpl(
      grouppedImageData,
      scaleX,
      scaleY
    );

    console.timeEnd("getting_resized_img");

    const newImageWidth = Math.floor(currentImageDataWidth * scaleX);
    const newImageHeight = Math.floor(currentImageDataHeight * scaleY);

    const context = this.createTemporaryCanvas(newImageWidth, newImageHeight);
    const newImageData = context.createImageData(newImageWidth, newImageHeight);

    for (let i = 0; i < newImageData.data.length; i++) {
      const rowIndex = Math.floor(i / 4 / newImageWidth);
      const groupIndex = Math.floor(i / 4) % newImageWidth;

      const origImageStartIndex = resizedImageData[rowIndex][groupIndex];
      newImageData.data[i] = data[origImageStartIndex + (i % 4)];
    }

    return newImageData;
  }

  private loadImage(): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(this.imageFile);

      img.onload = () => {
        resolve(img);
      };
    });
  }

  private createTemporaryCanvas(
    width: number,
    height: number
  ): CanvasRenderingContext2D {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Context is null for temporary canvas");
    }

    return context;
  }
}
