import { styled } from "styled-components";

export const Container = styled.div`
  padding: 9px 18px;
  border-bottom: 1px solid white;
  background: rgba(39, 39, 39, 1);
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ToolList = styled.div`
  display: flex;
  align-items: center;
  flex: 1;

  gap: 16px;
  margin: 0 20px;
  padding: 0 16px;

  border-left: 1px solid black;
  border-right: 1px solid black;
`;
