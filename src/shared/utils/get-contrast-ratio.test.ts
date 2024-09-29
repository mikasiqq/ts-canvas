import { getContrastRatio } from "./get-contrast-ratio";

describe("Contrast ratio calculation", () => {
  it("should be valid on test #1", () => {
    expect(getContrastRatio([255, 255, 255], [0, 0, 0])).toEqual(21);
  });

  it("should be valid on test #2", () => {
    expect(getContrastRatio([35, 146, 33], [0, 0, 0])).toEqual(5.2);
  });

  it("should be valid on test #3", () => {
    expect(getContrastRatio([9, 16, 33], [9, 0, 33])).toEqual(
      +(1.07 / 1).toFixed(2)
    );
  });

  it("should be valid on test #4", () => {
    expect(getContrastRatio([146, 1, 1], [41, 25, 33])).toEqual(1.77);
  });
});
