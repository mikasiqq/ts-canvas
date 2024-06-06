import { makeAutoObservable } from "mobx";
import { Nullable } from "../types";

export interface Size {
  width: number;
  height: number;
}

class ImageSettingsStore {
  imageUrl: Nullable<string> = null;
  imageSize: Nullable<Size> = null;
  scale: number = 100;
  measurement: "pixels" | "percentage" = "pixels";
  isAspectRatio = false;

  constructor() {
    makeAutoObservable(this);
  }

  get formattedSize(): Nullable<Size> {
    if (!this.imageSize) return null;

    return {
      width: (this.imageSize.width * this.scale) / 100,
      height: (this.imageSize.height * this.scale) / 100,
    };
  }

  setImageUrl = (value: string | null) => {
    this.imageUrl = value;
  };

  setImageSize = (
    value: Size,
    measurement: "pixels" | "percentage",
    aspectRatio?: boolean
  ) => {
    this.imageSize = value;
    this.measurement = measurement;
    if (aspectRatio) {
      this.isAspectRatio = aspectRatio;
    }
  };

  setScale = (value: number) => {
    this.scale = value;
  };
}

export default new ImageSettingsStore();
