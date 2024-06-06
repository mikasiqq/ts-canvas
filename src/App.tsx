import { observer } from "mobx-react-lite";
import "./App.css";
import { ImageCanvas } from "./components/ImageCanvas";
import { ImageUpload } from "./components/ImageUpload";
import imageSettingsStore from "./stores/image-settings-store";

export const App = observer(() => {
  const { imageUrl } = imageSettingsStore;

  return (
    <>
      {imageUrl ? (
        <ImageCanvas imageUrl={imageUrl} />
      ) : (
        "No image was uploaded!"
      )}

      <br />

      <ImageUpload />
    </>
  );
});
