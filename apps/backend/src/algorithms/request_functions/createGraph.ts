import { Response } from "express";
import {
  BuildingType,
  FloorType,
  Graph,
  Node,
  NodeType,
} from "common/src/DataStructures";
import PrismaClient from "../../bin/database-connection";

export { createGraph };
async function createGraph(
  res: Response,
  includeStairs: boolean,
): Promise<Graph> {
  const graph: Graph = new Graph();
  const edges = await PrismaClient.edge.findMany();
  if (edges === null) {
    res.sendStatus(404);
    return graph;
  }

  for (const edge of edges) {
    const edgeID: string = edge.edgeID;
    const startNodeID: string = edge.startNodeID;
    const endNodeID: string = edge.endNodeID;

    let startNode = graph.getNodeByID(startNodeID);
    if (!startNode) {
      const nodeData = await PrismaClient.node.findUnique({
        where: {
          nodeID: startNodeID,
        },
      });
      if (nodeData === null) {
        res.sendStatus(404);
        console.log("Could not find start node with ID: " + startNodeID);
        continue;
      }
      startNode = new Node(
        nodeData.nodeID as string,
        nodeData.xcoord as number,
        nodeData.ycoord as number,
        nodeData.floor as FloorType,
        nodeData.building as BuildingType,
        nodeData.nodeType as NodeType,
        nodeData.longName as string,
        nodeData.shortName as string,
      );
      graph.getLookupTable().set(startNodeID, startNode);
    }

    let endNode = graph.getNodeByID(endNodeID);
    if (!endNode) {
      const nodeData = await PrismaClient.node.findUnique({
        where: {
          nodeID: endNodeID,
        },
      });
      if (nodeData === null) {
        res.sendStatus(404);
        console.log("Could not find end node with ID: " + endNodeID);
        continue;
      }
      endNode = new Node(
        nodeData.nodeID as string,
        nodeData.xcoord as number,
        nodeData.ycoord as number,
        nodeData.floor as FloorType,
        nodeData.building as BuildingType,
        nodeData.nodeType as NodeType,
        nodeData.longName as string,
        nodeData.shortName as string,
      );
      graph.getLookupTable().set(endNodeID, endNode);
    }

    if (startNode && endNode) {
      if (includeStairs) {
        graph.addEdge(edgeID, startNode, endNode);
        graph.addEdge(edgeID, endNode, startNode);
      } else {
        graph.addEdgeNoStairs(edgeID, startNode, endNode);
        graph.addEdgeNoStairs(edgeID, endNode, startNode);
      }
    }
  }
  return graph;
}
