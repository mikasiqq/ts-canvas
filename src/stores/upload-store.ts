import { makeAutoObservable } from "mobx";
import { Nullable } from "../types";
import imageSettingsStore from "./image-settings-store";

interface ImageUrl {
  file: Nullable<string>;
  href: Nullable<string>;
}

interface Dimensions {
  height: number;
  width: number;
}

class ImageUploadStore {
  imageUrl: ImageUrl = {
    file: null,
    href: null,
  };
  isModalOpen = false;
  resizeMeasurement: "percentage" | "pixels" = "pixels";
  isAspectRatio = false;
  dimensions: Dimensions = {
    height: 0,
    width: 0,
  };

  constructor() {
    makeAutoObservable(this);
  }

  setModalOpen = (value: boolean) => {
    this.isModalOpen = value;
  };

  handleUrlChange = (value: Nullable<string>) => {
    this.imageUrl.href = value;
  };

  handleFileUpload = (files: Nullable<FileList>) => {
    if (!files) return;

    const [file] = files;
    if (!file) return;

    const url = URL.createObjectURL(file);
    this.imageUrl.href = null;
    this.imageUrl.file = url;
  };

  handleDone = () => {
    imageSettingsStore.setImageUrl(this.imageUrl.href || this.imageUrl.file);
    imageSettingsStore.setImageSize(
      { ...this.dimensions },
      this.resizeMeasurement,
      this.isAspectRatio
    );
    this.closeModal();
  };

  closeModal = () => {
    this.isModalOpen = false;
  };

  setIsModalOpen = (value: boolean) => {
    this.isModalOpen = value;
  };

  setResizeMeasurement = (value: "percentage" | "pixels") => {
    this.resizeMeasurement = value;
  };

  setIsAspectRatio = (value: boolean) => {
    this.isAspectRatio = value;
  };

  setHeight = (value: number) => {
    this.dimensions.height = value;
  };

  setWidth = (value: number) => {
    this.dimensions.width = value;
  };
}

export default new ImageUploadStore();
