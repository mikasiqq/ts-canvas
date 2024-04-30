import React, { useRef, useState } from "react";
import { ImageCanvas } from "./ImageCanvas"; // Предполагается, что ImageCanvas находится в том же каталоге

export const ImageUpload = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    if (file) {
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const applyImageUrl = () => {
    if (urlInputRef.current) {
      const url = urlInputRef.current.value;
      setImageUrl(url);
    }
  };

  return (
    <>
      {imageUrl ? (
        <ImageCanvas imageUrl={imageUrl} />
      ) : (
        "No umage was uploaded!"
      )}
      <br />
      <input type="file" name="myImage" onChange={handleUpload} />
      <input type="text" placeholder="Enter image URL" ref={urlInputRef} />
      <button onClick={applyImageUrl}>Use this url</button>
    </>
  );
};
