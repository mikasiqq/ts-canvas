import styled from "styled-components";
import { ActiveTool } from "../../entities/tools/model";

type PickTool<T, K extends string> = T extends { name: K } ? T : never;

type CursorStateMap = {
  [K in Exclude<ActiveTool, null>["name"]]: (
    t: PickTool<Exclude<ActiveTool, null>, K>
  ) => import("csstype").Property.Cursor;
};

const cursorStateMap: CursorStateMap = {
  mover: ({ state }) => (state === "grabbing" ? "grabbing" : "grab"),
  pipette: ({ state }) => (state === "active" ? "crosshair" : "default"),
};

export const MainContainer = styled.main<{ activeTool: ActiveTool }>`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;

  height: 100%;

  background: lightgray;

  cursor: ${(props) =>
    props?.activeTool?.name && props?.activeTool.name in cursorStateMap
      ? cursorStateMap[props.activeTool.name](props.activeTool as any)
      : "321"};
`;
