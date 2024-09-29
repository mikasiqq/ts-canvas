import { InputNumber, Select } from "antd";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { setScale } from "../../entities/renderer";
import { ColorPreview } from "../../shared/ui/color-preview";
import {
  Container,
  Coordinates,
  FooterContainer,
  LeftContainer,
  Tools,
} from "./styles";

export const BottomEditorInfo: React.FC = () => {
  const dispatch = useAppDispatch();

  const color = useAppSelector((state) => state.toolSlice.pipetteColor);
  const metaInfo = useAppSelector((state) => state.toolSlice.pipetteMetaInfo);
  const cursorX = useAppSelector((state) => state.canvasSlice.cursorX);
  const cursorY = useAppSelector((state) => state.canvasSlice.cursorY);
  const canvasSize = useAppSelector((state) => state.canvasSlice.canvasSize);
  const imagesSize = useAppSelector((state) => state.canvasSlice.imagesSize);
  const isCanvasEmpty = useAppSelector(
    (state) => state.canvasSlice.isCanvasEmpty
  );
  const scaleInPercent = useAppSelector(
    (state) => state.canvasSlice.scaleInPercent
  );

  const handleScaleChange = (value: number | null) => {
    dispatch(setScale(value ?? 0));
  };

  return (
    <FooterContainer>
      <LeftContainer>
        <div>
          Размер canvas: {canvasSize.width ?? 0}x{canvasSize.height ?? 0}
        </div>
        <div>
          Размер изображения: {imagesSize.width ?? 0}x{imagesSize.height ?? 0}
        </div>

        {!isCanvasEmpty && (
          <Tools>
            <Container>
              <span>Масштаб %</span>
              <Select
                options={[
                  { value: 20, label: 20 },
                  { value: 50, label: 50 },
                  { value: 75, label: 75 },
                  { value: 100, label: 100 },
                  { value: 150, label: 150 },
                  { value: 250, label: 250 },
                  { value: 300, label: 300 },
                ]}
                onChange={handleScaleChange}
                value={scaleInPercent}
              />
              <InputNumber
                placeholder={"%"}
                max={500}
                min={20}
                value={scaleInPercent}
                onChange={handleScaleChange}
              />
            </Container>
          </Tools>
        )}

        {color && !isCanvasEmpty && (
          <>
            Координаты: {metaInfo.imageX} x {metaInfo.imageY}
          </>
        )}
        <Coordinates>
          ImageCoords: {cursorX ?? "-"} x {cursorY ?? "-"}
        </Coordinates>
      </LeftContainer>

      {color && !isCanvasEmpty && (
        <ColorPreview color={color} showMeta={true} />
      )}
    </FooterContainer>
  );
};
