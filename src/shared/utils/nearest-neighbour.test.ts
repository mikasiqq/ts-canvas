import { nearestNeighbourImpl } from "./nearest-neighbour";

describe("Nearest neighbour algortihm test", () => {
  it("should clearly work with whole coef < 1", () => {
    expect(
      nearestNeighbourImpl(
        [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]],
        0.5,
        1
      )
    ).toStrictEqual([[1, 3, 5, 7, 9, 11, 13]]);
  });
  it("should clearly work with whole coef > 1", () => {
    expect(nearestNeighbourImpl([[1, 2, 3, 4]], 2, 1)).toStrictEqual([
      [1, 1, 2, 2, 3, 3, 4, 4],
    ]);
  });

  it("should clearly work with whole coef < 1 for 2 dimensions", () => {
    expect(
      nearestNeighbourImpl(
        [
          [1, 2, 3, 4],
          [5, 6, 7, 8],
          [9, 10, 11, 12],
          [13, 14, 15, 16],
        ],
        0.5,
        0.5
      )
    ).toStrictEqual([
      [1, 3],
      [9, 11],
    ]);
  });

  it("should clearly work with whole coef > 1 for 2 dimensions", () => {
    expect(
      nearestNeighbourImpl(
        [
          [1, 2, 3, 4],
          [5, 6, 7, 8],
          [9, 10, 11, 12],
          [13, 14, 15, 16],
        ],
        2,
        2
      )
    ).toStrictEqual([
      [1, 1, 2, 2, 3, 3, 4, 4],
      [1, 1, 2, 2, 3, 3, 4, 4],
      [5, 5, 6, 6, 7, 7, 8, 8],
      [5, 5, 6, 6, 7, 7, 8, 8],
      [9, 9, 10, 10, 11, 11, 12, 12],
      [9, 9, 10, 10, 11, 11, 12, 12],
      [13, 13, 14, 14, 15, 15, 16, 16],
      [13, 13, 14, 14, 15, 15, 16, 16],
    ]);
  });

  it("should cleary work with not whole coef", () => {
    expect(nearestNeighbourImpl([[1, 2, 3, 4]], 1.5, 1)).toStrictEqual([
      [1, 1, 2, 3, 3, 4],
    ]);
  });
});

export {};
