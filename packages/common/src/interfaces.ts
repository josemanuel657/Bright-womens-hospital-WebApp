export interface node {
  nodeID: string;
  xcoord: number;
  ycoord: number;
  floor: string;
  building: string;
  nodeType: string;
  longName: string;
  shortName: string;
}

export interface edge {
  edgeID: string;
  startNodeID: string;
  endNodeID: string;
}
