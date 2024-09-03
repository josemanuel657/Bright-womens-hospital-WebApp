import { FloorType } from "../DataStructures.ts";
import { FloorMap } from "./FloorMap.ts";

export class BuildingMap {
  private readonly floorMaps: Array<FloorMap>;

  public constructor(floorMaps: Array<FloorMap>) {
    this.floorMaps = floorMaps;
  }

  public getFloorMaps(): Array<FloorMap> {
    return this.floorMaps;
  }

  public getFloorMap(floorType: FloorType): FloorMap {
    for (const floorMap of this.floorMaps) {
      if (floorType === floorMap.getFloorType()) return floorMap;
    }
    return this.floorMaps[0];
  }
}
