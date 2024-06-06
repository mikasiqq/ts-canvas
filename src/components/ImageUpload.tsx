import { Button, Checkbox, Input, Modal, Select } from "antd";
import { Option } from "antd/es/mentions";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import imageSettingsStore from "../stores/image-settings-store";
import uploadStore from "../stores/upload-store";

export const ImageUpload: FC = observer(() => {
  const {
    isModalOpen,
    closeModal,
    handleDone,
    handleFileUpload,
    imageUrl,
    handleUrlChange,
    setIsModalOpen,
    resizeMeasurement,
    setResizeMeasurement,
    isAspectRatio,
    setIsAspectRatio,
    setHeight,
    setWidth,
    dimensions,
  } = uploadStore;
  const { imageSize } = imageSettingsStore;

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>Upload Image</Button>

      <Modal
        title="Upload Image"
        open={isModalOpen}
        onCancel={closeModal}
        footer={[
          <Button key="apply" type="primary" onClick={handleDone}>
            Apply
          </Button>,
        ]}
      >
        <input
          type="file"
          onChange={(e) => handleFileUpload(e.target.files)}
          style={{ marginBottom: "10px" }}
        />

        <Input
          placeholder="Enter image URL"
          value={imageUrl.href ? imageUrl.href : undefined}
          onChange={(e) => handleUrlChange(e.target.value)}
          style={{ marginBottom: "10px" }}
        />

        <Select
          value={resizeMeasurement}
          style={{ width: 120 }}
          placeholder="Select resize method"
          onChange={setResizeMeasurement}
        >
          <Option value="percentage">В процентах</Option>
          <Option value="pixels">В пикселях</Option>
        </Select>

        <Input
          onChange={(e) => setWidth(Number(e.target.value))}
          placeholder="Width"
          style={{ margin: "10px 0" }}
        />
        <Input
          onChange={(e) => setHeight(Number(e.target.value))}
          placeholder="Height"
          style={{ marginBottom: "10px" }}
        />

        <Checkbox
          value={isAspectRatio}
          onChange={(e) => setIsAspectRatio(e.target.checked)}
        >
          Учитывать соотношение сторон
        </Checkbox>

        <h3>
          Размер до: ширина - {imageSize?.width || "не определена"}, высота -{" "}
          {imageSize?.height || "не определена"}
        </h3>
        <h3>
          Размер после: ширина - {dimensions.width || "не определена"}, высота -{" "}
          {dimensions.height || "не определена"}
        </h3>
      </Modal>
    </>
  );
});
