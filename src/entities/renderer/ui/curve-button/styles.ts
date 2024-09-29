import styled from "styled-components";

const HistorgramContainer = styled.div`
  width: 400px;
  height: 400px;
`;

const ButtonGrid = styled.div`
  display: grid;
  width: 100%;
  grid-template-rows: 30px 30px;
  grid-gap: 10px;
  grid-template-columns: 100px 100px 100px;
`;

const ModalContainer = styled.div`
  display: flex;

  align-items: flex-start;
  justify-content: center;
  gap: 40px;
`;

export const PreviewContainer = styled.div`
  width: 400px;
  height: 400px;
`;

export const PreviewEmpty = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 8px;
  width: 100%;
  height: 100%;

  color: gray;
  font-size: 18px;
  border: 4px solid gray;
`;

export { ButtonGrid, HistorgramContainer, ModalContainer };
