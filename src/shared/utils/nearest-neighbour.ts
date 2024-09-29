export const nearestNeighbourImpl = <T>(
  map: T[][],
  widthCoef: number,
  heightCoef: number
) => {
  const newMap: T[][] = [];

  /**
   * Check https://arxiv.org/ftp/arxiv/papers/2003/2003.06885.pdf for comparing other rounding algorithm
   */
  const roundAlgorithm = Math.floor;

  const newMapI = roundAlgorithm(Math.max(map.length * heightCoef, 1)) - 1;
  const newMapJ = roundAlgorithm(Math.max(map[0].length * widthCoef, 1)) - 1;

  for (let i = 0; i <= newMapI; i++) {
    const nearI = roundAlgorithm(i * (1 / heightCoef));
    newMap[i] = [];
    for (let j = 0; j <= newMapJ; j++) {
      const nearJ = roundAlgorithm(j * (1 / widthCoef));
      newMap[i][j] = map[nearI][nearJ];
    }
  }

  return newMap;
};
