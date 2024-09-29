import { RgbColor, XyzColor } from "./types";

const D65 = [0.3127 / 0.329, 1.0, (1.0 - 0.3127 - 0.329) / 0.329];

export const convertToRgb = (rgb: RgbColor) =>
  `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;

/**
 * Get gamma expanded values regarding formluta describing here: https://en.wikipedia.org/wiki/SRGB#Specification_of_the_transformation
 */
export const convertsRGBToLinearRGB = (color: number) => {
  if (color <= 0.04045) {
    return color / 12.92;
  }
  return Math.pow((color + 0.055) / 1.055, 2.4);
};

/**
 * Transformation algorithm and matrix values from: https://en.wikipedia.org/wiki/SRGB#Specification_of_the_transformation
 * W3 code examples: https://www.w3.org/TR/css-color-4/#color-conversion-code
 */
export const convertRgbToXYZ = (rgb: RgbColor, pure = false): XyzColor => {
  const [r, g, b] = rgb.map((c) => c / 255).map(convertsRGBToLinearRGB);

  const X = 0.4124 * r + 0.3576 * g + 0.1805 * b;
  const Y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const Z = 0.0193 * r + 0.1192 * g + 0.9505 * b;

  if (pure) {
    return [X, Y, Z];
  }
  return [X, Y, Z].map((c) => Math.floor(c * 100)) as XyzColor;
};

/**
 * Algorithm from https://www.w3.org/TR/css-color-4/#color-conversion-code
 * First of all we are converting rgb to xyz, then xyz to lab
 */
export const convertRgbToLab = (rgb: RgbColor) => {
  const XYZ = convertRgbToXYZ(rgb, true);

  const e = 216 / 24389; // 6^3/29^3
  const k = 24389 / 27; // 29^3/3^3

  const xyz = XYZ.map((value, i) => value / D65[i]);

  // now compute f
  const f = xyz.map((value) =>
    value > e ? Math.cbrt(value) : k * value + 16 / 116
  );

  return [
    Math.floor(116 * f[1] - 16), // L
    Math.floor(500 * (f[0] - f[1])), // a
    Math.floor(200 * (f[1] - f[2])), // b
  ];
};
export const normalizeWithMax = (maxValue: number) => (values: number[]) =>
  values.map((val) => (val / maxValue) * 255);

/**
 * Usage in image each of channel in range 0..255
 */
export interface RgbStatistic {
  r: number[];
  g: number[];
  b: number[];
}
export const getRgbStatistic = (imageData: Uint8ClampedArray): RgbStatistic => {
  const r = new Array(256).fill(0);
  const g = new Array(256).fill(0);
  const b = new Array(256).fill(0);

  for (let i = 0; i < imageData.length; i += 4) {
    r[imageData[i]]++;
    g[imageData[i + 1]]++;
    b[imageData[i + 2]]++;
  }

  const maxValue = Math.max(...r, ...g, ...b);
  const normalize = normalizeWithMax(maxValue);

  return {
    r: normalize(r),
    g: normalize(g),
    b: normalize(b),
  };
};

interface CurveLine {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export const getCurveLine = ({ startX, startY, endX, endY }: CurveLine) => {
  const line: number[] = new Array(256).fill(0);

  const slope = (endY - startY) / (endX - startX);
  const intercept = (endX * startY - startX * endY) / (endX - startX);

  for (let i = 0; i < 256; i++) {
    if (i < startX) {
      line[i] = startY;
      continue;
    }
    if (i > endX) {
      line[i] = endY;
      continue;
    }
    line[i] = Math.round(i * slope + intercept);
  }

  return line;
};

export const toneCorrectionByCurveLine = (
  imageData: ImageData,
  curveLine: number[]
) => {
  const newImageData = new Array(imageData.data.length).fill(0);

  for (let i = 0; i < imageData.data.length; i += 4) {
    newImageData[i] = curveLine[imageData.data[i]];
    newImageData[i + 1] = curveLine[imageData.data[i + 1]];
    newImageData[i + 2] = curveLine[imageData.data[i + 2]];
    newImageData[i + 3] = imageData.data[i + 3];
  }

  const imageDataWithCorrection = new ImageData(
    imageData.width,
    imageData.height
  );
  imageDataWithCorrection.data.set(newImageData);

  return imageDataWithCorrection;
};
