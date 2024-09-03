import axios from "axios";
import { Edge } from "./mapNodes.ts";

type importedMapNodes = {
  nodeID: string;
  xcoord: number;
  ycoord: number;
  floor: string;
  building: string;
  nodeType: string;
  longName: string;
  shortName: string;
};

export function postNodesAxios(
  deleteAll: string,
  importedMapNode: importedMapNodes[],
) {
  return new Promise((resolve, reject) => {
    if (deleteAll == "true") {
      axios
        .post(
          "/api/map/nodes",
          {
            deleteAll: true,
            nodes: importedMapNode,
          },
          {
            headers: {},
          },
        )
        .then(() => {
          resolve("Nodes Added");
          return;
        })
        .catch((error) => {
          reject(error);
          return;
        });
    } else {
      axios
        .post(
          "/api/map/nodes",
          {
            deleteAll: false,
            nodes: importedMapNode,
          },
          {
            headers: {},
          },
        )
        .then(() => {
          resolve("Nodes Added");
          return;
        })
        .catch((error) => {
          reject(error);
          return;
        });
    }
  });
}

export function getNodesAxios() {
  return axios.get("/api/map/nodes");
}

export function postEdgesAxios(deleteAll: string, importedMapEdge: Edge[]) {
  return new Promise((resolve, reject) => {
    if (deleteAll == "true") {
      axios
        .post(
          "/api/map/edges",
          {
            deleteAll: true,
            edges: importedMapEdge,
          },
          {
            headers: {},
          },
        )
        .then(() => {
          resolve("Edges Added");
          return;
        })
        .catch((error) => {
          reject(error);
          return;
        });
    } else {
      axios
        .post(
          "/api/map/edges",
          {
            deleteAll: false,
            edges: importedMapEdge,
          },
          {
            headers: {},
          },
        )
        .then(() => {
          resolve("Edges Added");
          return;
        })
        .catch((error) => {
          reject(error);
          return;
        });
    }
  });
}

export function getEdgesAxios() {
  return axios.get("/api/map/edges");
}
