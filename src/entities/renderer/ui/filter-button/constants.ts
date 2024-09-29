const DEFAULT_MATRIX_PRESET = [0, 0, 0, 0, 1, 0, 0, 0, 0];
const SHARP_MATRIX_PRESET = [0, -1, 0, -1, 5, -1, 0, -1, 0];
const GAUSE_MATRIX_PRESET = [1, 2, 1, 2, 4, 2, 1, 2, 1];
const RECT_BLUR_PRESET = [1, 1, 1, 1, 1, 1, 1, 1, 1];

const MATRIX_PRESET_MAP: Record<
  string,
  { matrix: number[]; baseCoef: number }
> = {
  default: {
    matrix: DEFAULT_MATRIX_PRESET,
    baseCoef: 1,
  },
  sharp: {
    matrix: SHARP_MATRIX_PRESET,
    baseCoef: 1,
  },
  gause: {
    matrix: GAUSE_MATRIX_PRESET,
    baseCoef: 1 / 16,
  },
  blur: {
    matrix: RECT_BLUR_PRESET,
    baseCoef: 1 / 9,
  },
};

export {
  DEFAULT_MATRIX_PRESET,
  SHARP_MATRIX_PRESET,
  GAUSE_MATRIX_PRESET,
  RECT_BLUR_PRESET,
  MATRIX_PRESET_MAP,
};
