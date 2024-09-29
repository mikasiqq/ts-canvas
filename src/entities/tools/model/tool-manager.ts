import { RootCanvas } from "../../canvas/model";
import { Renderer } from "../../renderer";
import { MoverTool } from "./mover";
import { FinishCallback, PipetteTool } from "./pipette";

export class ToolManager {
  private canvas: RootCanvas;

  public moverTool: MoverTool;
  public pipetteTool: PipetteTool;

  constructor(
    canvas: RootCanvas,
    renderer: Renderer,
    onPipetteChange: FinishCallback
  ) {
    this.canvas = canvas;

    this.pipetteTool = new PipetteTool(this.canvas, renderer, onPipetteChange);
    this.moverTool = new MoverTool(this.canvas, renderer);
  }
}
