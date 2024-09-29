import styled from "styled-components";

export const MatrixContainer = styled.div`
  margin-top: 20px;

  display: grid;
  grid-template-columns: repeat(3, 60px);
  grid-template-rows: repeat(3, 30px);
  gap: 12px;
`;

export const MatrixInput = styled.input`
  width: 40px;
  height: 40px;
`;

export const CernelTitle = styled.div`
  margin-top: 16px;
  font-size: 16px;
  font-weight: bold;
`;

export const BaseCoef = styled.div`
  margin-top: 20px;
  display: grid;
  grid-template-columns: auto 90px;
  align-items: center;
`;
