import { AxiosResponse } from "axios";
import { getEdgesAxios, getNodesAxios } from "./nodesAxios.ts";

export type MapNode = {
  nodeID: string;
  xcoord: number;
  ycoord: number;
  floor: string;
  building: string;
  nodeType: string;
  longName: string;
  shortName: string;
  edges: MapNode[];
};

export type Edge = {
  edgeID: string;
  startNode: string;
  endNode: string;
};

export const mapNodes: Map<string, MapNode> = new Map([]);
export const mapEdges: Map<string, Edge> = new Map([]);

getMapNodesEdges();

export function getMapNodesEdges() {
  mapNodes.clear();
  mapEdges.clear();
  return new Promise((resolve, reject) => {
    getNodesAxios()
      .then((response: AxiosResponse<MapNode[]>) => {
        response.data.forEach((node) => {
          node.edges = [];
          mapNodes.set(node.nodeID, node);
        });

        getEdgesAxios()
          .then((response: AxiosResponse<Edge[]>) => {
            response.data.forEach((edge) => {
              const n1 = mapNodes.get(edge.startNode);
              const n2 = mapNodes.get(edge.endNode);
              if (n1 !== undefined && n2 !== undefined) {
                n1.edges.push(n2);
                n2.edges.push(n1);
              }
              mapEdges.set(String(edge.edgeID), edge);
            });
            resolve(mapNodes);
          })
          .catch((error) => {
            reject("no");
            console.error("Error fetching data:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  });
}
