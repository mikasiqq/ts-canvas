export const getImageDataWithExtraPadding = (
  data: ArrayLike<number>,
  width: number,
  height: number
): ArrayLike<number> => {
  const widthWithPadding = width + 2;
  const heightWithPadding = height + 2;
  const extraPaddingSize = (2 * (widthWithPadding + heightWithPadding) - 4) * 4;
  const newImageDataLength = data.length + extraPaddingSize;

  const newImageData = new Array(newImageDataLength);
  const rowImageDataLength = widthWithPadding * 4;

  for (let k = 0; k < newImageDataLength; k += 4) {
    const i = Math.floor(k / rowImageDataLength);
    const j = k % rowImageDataLength;

    if (
      i === 0 ||
      j === 0 ||
      i === heightWithPadding - 1 ||
      j === rowImageDataLength - 4
    ) {
      const nearI = Math.max(0, Math.min(i - 1, heightWithPadding - 3));
      const nearJ = Math.max(0, Math.min(j / 4 - 1, widthWithPadding - 3));
      const nearIndex = (nearI * width + nearJ) * 4;
      newImageData[k] = data[nearIndex];
      newImageData[k + 1] = data[nearIndex + 1];
      newImageData[k + 2] = data[nearIndex + 2];
      newImageData[k + 3] = data[nearIndex + 3];
      continue;
    }

    /**
     * 1 1 1
     * 1 1 1
     * 1 1 1
     *
     * 0 0 0 0 0
     * 0 1 1 1 0
     * 0 1 1 1 0
     * 0 1 1 1 0
     * 0 0 0 0 0
     */
    const originalDataOffset = (i - 1) * width * 4 + j - 4;

    newImageData[k] = data[originalDataOffset];
    newImageData[k + 1] = data[originalDataOffset + 1];
    newImageData[k + 2] = data[originalDataOffset + 2];
    newImageData[k + 3] = data[originalDataOffset + 3];
  }
  return newImageData;
};

export const getFilteredImageData = (
  data: ArrayLike<number>,
  width: number,
  height: number,
  kernel3: number[],
  kernelCoef: number
): Uint8ClampedArray => {
  const imageDataWithPadding = getImageDataWithExtraPadding(
    data,
    width,
    height
  );

  const result = new Uint8ClampedArray(data.length);

  for (let y = 0; y < height + 2; y++) {
    for (let x = 0; x < width + 2; x++) {
      if (y === 0 || x === 0 || y === height + 1 || x === width + 1) continue;
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;

      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const posY = y + dy;
          const posX = x + dx;

          const kernelOffset = (dy + 1) * 3 + dx + 1;
          const coef = kernel3[kernelOffset];
          const imageOffset = (posY * (width + 2) + posX) * 4;

          r += imageDataWithPadding[imageOffset] * coef;
          g += imageDataWithPadding[imageOffset + 1] * coef;
          b += imageDataWithPadding[imageOffset + 2] * coef;
          a += imageDataWithPadding[imageOffset + 3] * coef;
        }
      }

      const offset = ((y - 1) * width + (x - 1)) * 4;

      result[offset] = Math.min(Math.max(r * kernelCoef, 0), 255);
      result[offset + 1] = Math.min(Math.max(g * kernelCoef, 0), 255);
      result[offset + 2] = Math.min(Math.max(b * kernelCoef, 0), 255);
      result[offset + 3] = Math.min(Math.max(a * kernelCoef, 0), 255);
    }
  }

  return result;
};
