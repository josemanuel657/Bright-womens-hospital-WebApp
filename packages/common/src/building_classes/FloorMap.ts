import { FloorType } from "../DataStructures.ts";

export class FloorMap {
  private readonly pngPath: string;
  private readonly floorType: FloorType;
  private readonly pixelWidth: number = 5000;
  private readonly pixelHeight: number = 3400;

  public constructor(pngPath: string, floorType: FloorType) {
    this.floorType = floorType;
    this.pngPath = pngPath;
  }

  public getPngPath(): string {
    return this.pngPath;
  }

  public getFloorType(): FloorType {
    return this.floorType;
  }

  public getPixelWidth(): number {
    return this.pixelWidth;
  }

  public getPixelHeight(): number {
    return this.pixelHeight;
  }

  public getPixelDimensions(): [number, number] {
    return [this.pixelWidth, this.pixelHeight];
  }
}
