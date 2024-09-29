import { getFilteredImageData, getImageDataWithExtraPadding } from "./filter";

describe("Filter function", () => {
  describe("getImageDataWithExtraPadding", () => {
    it("should add padding for square image", () => {
      // prettier-ignore
      const data = [
        1, 2, 3, 
        4, 5, 6, 
        7, 8, 9,
      ].flatMap((x) => [x, x, x, x]);

      const newImageData = getImageDataWithExtraPadding(data, 3, 3);

      expect(newImageData.length).toBe(25 * 4);
      // prettier-ignore
      expect(newImageData).toMatchObject([
        1, 1, 2, 3, 3, 
        1, 1, 2, 3, 3, 
        4, 4, 5, 6, 6, 
        7, 7, 8, 9, 9, 
        7, 7, 8, 9, 9,
      ].flatMap(x => [x, x, x, x]));
    });

    it("should add pedding for rectangular image", () => {
      // prettier-ignore
      const data = [
        1, 2, 3, 4, 
        5, 6, 7, 8
      ].flatMap((x) => [x, x, x, x]);

      const newImageData = getImageDataWithExtraPadding(data, 4, 2);
      expect(newImageData.length).toBe(24 * 4);

      // prettier-ignore
      expect(newImageData).toMatchObject([
      1, 1, 2, 3, 4, 4,
      1, 1, 2, 3, 4, 4,
      5, 5, 6, 7, 8, 8,
      5, 5, 6, 7, 8, 8
    ].flatMap((x) => [x, x, x, x])
      );
    });
  });
  describe("getFilteredImageData", () => {
    it("should work with default kernel", () => {
      // prettier-ignore
      const data = [
        1, 2, 3, 
        4, 5, 6, 
        7, 8, 9,
      ].flatMap((x) => [x, x, x, x]);

      // prettier-ignore
      const kernel = [
        0, 0, 0,
        0, 1, 0,
        0, 0, 0,
      ];

      const filteredData = getFilteredImageData(data, 3, 3, kernel, 1);
      expect(filteredData.length).toBe(data.length);
      expect(filteredData).toMatchObject(Array.from(filteredData));
    });
  });
});
