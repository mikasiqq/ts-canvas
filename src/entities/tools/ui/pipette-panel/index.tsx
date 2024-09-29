import React, { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../../../../app/store";
import { ColorPreview } from "../../../../shared/ui/color-preview";

import { CloseOutlined } from "@ant-design/icons";
import { Alert } from "antd";
import { getContrastRatio } from "../../../../shared/utils/get-contrast-ratio";
import { Container } from "./styles";

export const PipettePanel: React.FC = () => {
  const activeTool = useAppSelector((state) => state.toolSlice.activeTool);
  const isPipetteAction = useMemo(
    () => activeTool?.name === "pipette",
    [activeTool]
  );
  const [isOpen, setIsOpen] = useState(false);

  const primaryColor = useAppSelector(
    (state) => state.toolSlice.primaryPipetteColor?.value
  );
  const secondaryColor = useAppSelector(
    (state) => state.toolSlice.secondaryPipetteColor?.value
  );

  const primaryMetaInfo = useAppSelector(
    (state) => state.toolSlice.primaryPipetteColor?.metaInfo
  );
  const secondaryMetaInfo = useAppSelector(
    (state) => state.toolSlice.secondaryPipetteColor?.metaInfo
  );

  const isContrast = useMemo<null | boolean>(() => {
    if (!primaryColor || !secondaryColor) return null;

    const { isContrast: isColorContrast, ratio } = getContrastRatio(
      primaryColor,
      secondaryColor
    );
    return isColorContrast;
  }, [primaryColor, secondaryColor]);

  useEffect(() => {
    if (isPipetteAction) {
      setIsOpen(true);
    }
  }, [isPipetteAction]);

  const onCrossClick: React.MouseEventHandler<HTMLSpanElement> = (event) => {
    event.stopPropagation();
    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Container>
      <CloseOutlined onClick={onCrossClick} />
      <ColorPreview
        color={primaryColor}
        title={JSON.stringify(primaryMetaInfo, null, 4)}
      />
      <ColorPreview
        color={secondaryColor}
        title={JSON.stringify(secondaryMetaInfo, null, 4)}
      />
      {isContrast !== null && !isContrast && (
        <Alert type="warning" message="Недостаточно контраста" />
      )}
    </Container>
  );
};
