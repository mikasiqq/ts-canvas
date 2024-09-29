import React from "react";
import styled from "styled-components";
import { FileUploader } from "../../entities/renderer";
import { Container, ToolList } from "./style";

import { CurveButton, ResizeButton } from "../../entities/renderer";
import { FilterButton } from "../../entities/renderer/ui/filter-button";
import {
  DragButton,
  PipetteButton,
  PipettePanel,
} from "../../entities/tools/ui";

export const TopEditorPanel: React.FC = () => {
  return (
    <Container>
      <FileUploader />
      <ToolList>
        <ButtonContainer>
          <ResizeButton />
          <CurveButton />
          <FilterButton />
        </ButtonContainer>
        <DragButton />
        <PipetteButton />
        <PipettePanel />
      </ToolList>
    </Container>
  );
};

const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
`;
