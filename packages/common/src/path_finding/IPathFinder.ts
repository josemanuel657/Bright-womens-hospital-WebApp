import { Node, Path } from "../DataStructures.ts";

export interface IPathFinder {
  findPath(startNode: Node, endNode: Node): Path | undefined;
}
