import { makeAutoObservable } from "mobx";
import { Nullable } from "../types";

interface Coordinates {
  x: number;
  y: number;
}

class ImageCanvasStore {
  color: Nullable<string> = null;
  coordinates: Nullable<Coordinates> = null;

  constructor() {
    makeAutoObservable(this);
  }

  setColor = (value: Nullable<string>) => {
    this.color = value;
  };

  setCoordinates = (value: Nullable<Coordinates>) => {
    this.coordinates = value;
  };
}

export default new ImageCanvasStore();
