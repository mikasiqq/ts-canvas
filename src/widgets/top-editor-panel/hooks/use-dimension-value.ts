import { useEffect, useState } from "react";

export type Dimension = "PERCENT" | "PIXEL";

export const useDimensionValue = (
  dimension: Dimension,
  initialValue: number
) => {
  const [value, setValue] = useState<number>(initialValue);
  const [valueInPercent, setValueInPercent] = useState<number>(100);

  useEffect(() => {
    if (initialValue === 0) {
      setValue(0);
      return;
    }
    if (dimension === "PERCENT") {
      setValue(Math.floor((value / initialValue) * 100));
    } else {
      setValue(Math.floor(initialValue * (value / 100)));
    }
  }, [dimension]);

  useEffect(() => {
    if (dimension === "PERCENT") {
      setValue(100);
    } else {
      setValue(initialValue);
    }
  }, [initialValue]);

  useEffect(() => {
    if (dimension === "PERCENT") {
      setValueInPercent(value);
      return;
    }
    setValueInPercent((value / initialValue) * 100);
  }, [dimension, initialValue, value]);

  return {
    value,
    setValue,
    valueInPercent,
  };
};
