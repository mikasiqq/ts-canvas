import {
  Button,
  Checkbox,
  Flex,
  Input,
  Modal,
  Radio,
  RadioChangeEvent,
  Space,
} from "antd";
import { ChangeEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import { getFilteredImageData } from "../../../../shared/utils";
import { updateCanvasByFilter } from "../../model";
import { Preview } from "../curve-button/preview";
import { PreviewEmpty } from "../curve-button/styles";
import { MATRIX_PRESET_MAP } from "./constants";
import { BaseCoef, CernelTitle, MatrixContainer } from "./styles";

export const FilterButton = () => {
  const dispatch = useAppDispatch();
  const isCanvasEmpty = useAppSelector(
    (state) => state.canvasSlice.isCanvasEmpty
  );
  const renderer = useAppSelector((state) => state.canvasSlice.renderer);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [matrix, setMatrix] = useState([0, 0, 0, 0, 1, 0, 0, 0, 0]);
  const [matrixPreset, setMatrixPreset] = useState("default");
  const [baseMatrixCoef, setBaseMatrixCoef] = useState(1);
  const [previewData, setPreviewData] = useState<ImageData>();

  const handleMatrixChange =
    (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.currentTarget;
      setMatrix((prev) => {
        const newMatrix = [...prev];
        newMatrix[index] = Number(value);
        return newMatrix;
      });
    };

  const handleMatrixPresetChange = (event: RadioChangeEvent) => {
    const { value } = event.target;
    setMatrixPreset(value);
    setMatrix(MATRIX_PRESET_MAP[value].matrix);
    setBaseMatrixCoef(MATRIX_PRESET_MAP[value].baseCoef);
  };

  const updatePrewiewData = async (kernel: number[], coef: number) => {
    const result = await renderer?.getDrawable(0)?.getData();
    if (!result) return;

    const data = getFilteredImageData(
      result.data,
      result.width,
      result.height,
      kernel,
      coef
    );

    const imageData = new ImageData(result.width, result.height);
    imageData.data.set(data);
    setPreviewData(imageData);
  };

  const handleResetButton = () => {
    setMatrixPreset("default");
    setMatrix(MATRIX_PRESET_MAP["default"].matrix);
    setBaseMatrixCoef(MATRIX_PRESET_MAP["default"].baseCoef);
  };

  const handleOkButton = () => {
    dispatch(
      updateCanvasByFilter({
        kernel: matrix,
        kernelBaseCoef: baseMatrixCoef,
      })
    );
    setIsModalOpen(false);
  };

  useEffect(() => {
    updatePrewiewData(matrix, baseMatrixCoef);
  }, [matrix, isModalOpen, baseMatrixCoef]);

  return (
    <>
      <Button
        disabled={isCanvasEmpty}
        onClick={() => setIsModalOpen(true)}
        type="primary"
      >
        Фильтры
      </Button>
      <Modal
        title="Фильтрация изображения"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleOkButton}
        width={750}
      >
        <Flex justify="center" gap={20}>
          <div>
            <MatrixContainer>
              {Array(9)
                .fill(0)
                .map((_, i) => (
                  <Input
                    key={i}
                    value={matrix[i]}
                    onChange={handleMatrixChange(i)}
                  />
                ))}
            </MatrixContainer>
            <BaseCoef>
              <span>Базовый коэффицент</span>
              <Input
                title="Base coef"
                value={baseMatrixCoef}
                type="number"
                onChange={(event) =>
                  setBaseMatrixCoef(Number(event.currentTarget.value))
                }
              />
            </BaseCoef>
            <Flex gap={16} vertical={true} align="flex-start">
              <CernelTitle>
                <span>Преднастроенные значения:</span>
              </CernelTitle>
              <Radio.Group
                value={matrixPreset}
                onChange={handleMatrixPresetChange}
              >
                <Space direction="vertical">
                  <Radio value="default">Default</Radio>
                  <Radio value="sharp">Sharpening</Radio>
                  <Radio value="gause">Gaussian filter</Radio>
                  <Radio value="blur">Rectangular blur</Radio>
                </Space>
              </Radio.Group>
              <Flex vertical gap={16}>
                <Checkbox
                  value={isPreviewOpen}
                  onChange={(event) => setIsPreviewOpen(event.target.checked)}
                >
                  Предпросмотр
                </Checkbox>
                <Button onClick={handleResetButton}>Reset</Button>
              </Flex>
            </Flex>
          </div>
          {isPreviewOpen && previewData ? (
            <Preview drawableData={previewData} />
          ) : (
            <div style={{ width: 400, height: 400, paddingBottom: 20 }}>
              <PreviewEmpty>
                <span>Нажмите "Предпросмотр", чтобы увидеть результат</span>
              </PreviewEmpty>
            </div>
          )}
        </Flex>
      </Modal>
    </>
  );
};
