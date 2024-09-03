import { Node, Path } from "../DataStructures.ts";
import { IPathFinder } from "../PathFinder.ts";

export class Strategy {
  private pathFinder: IPathFinder;

  constructor(pathFinder: IPathFinder) {
    this.pathFinder = pathFinder;
  }

  setStrategy(pathFinder: IPathFinder) {
    this.pathFinder = pathFinder;
  }

  findPath(startNode: Node, endNode: Node): Path | undefined {
    return this.pathFinder.findPath(startNode, endNode);
  }
}
