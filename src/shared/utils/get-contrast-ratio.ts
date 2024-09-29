import { RgbColor } from "./types";

const calcColor = (c: number) => {
  const color = c / 255;

  if (color <= 0.03928) {
    return color / 12.92;
  }
  return Math.pow((color + 0.055) / 1.055, 2.4);
};

const getL = (color: RgbColor) => {
  return 0.2126 * color[0] + 0.7152 * color[1] + 0.0722 * color[2];
};

/**
 * Check contrast regarding this algrorithm: https://www.w3.org/TR/WCAG20-TECHS/G18.html
 */
export const getContrastRatio = (
  color1: RgbColor,
  color2: RgbColor
): { ratio: number; isContrast: boolean } => {
  const L1 = getL([
    calcColor(color1[0]),
    calcColor(color1[1]),
    calcColor(color1[2]),
  ]);

  const L2 = getL([
    calcColor(color2[0]),
    calcColor(color2[1]),
    calcColor(color2[2]),
  ]);

  const contrastRatio = +((L1 + 0.05) / (L2 + 0.05)).toFixed(2);

  return {
    ratio: contrastRatio,
    isContrast: contrastRatio >= 4.5 || contrastRatio <= 1 / 4.5,
  };
};
