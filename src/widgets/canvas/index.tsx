import { Flex } from "antd";
import React from "react";
import { CANVAS_ROOT_ID } from "../../entities/canvas/model";

import { PARENT_CONTAINER_ID } from "../../entities/renderer";
import { CanvasContainer, CanvasWrapper } from "./styles";

export const Canvas: React.FC = () => {
  return (
    <Flex
      style={{
        overflow: "hidden",
        position: "relative",
        margin: 50,
      }}
    >
      <CanvasWrapper id={PARENT_CONTAINER_ID}>
        <CanvasContainer id={CANVAS_ROOT_ID}></CanvasContainer>
      </CanvasWrapper>
    </Flex>
  );
};
