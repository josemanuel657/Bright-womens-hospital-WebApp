import { Node } from "./Node.ts";
import { NodeType } from "./NodeType.ts";

export class Edge {
  public ID: string;
  public startNode: Node;
  public endNode: Node;
  private readonly weight: number;

  public constructor(ID: string, startNode: Node, endNode: Node) {
    const x1: number = startNode.x;
    const y1: number = startNode.y;
    const x2: number = endNode.x;
    const y2: number = endNode.y;
    let result: number = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const nodeType1: NodeType = startNode.type;
    const nodeType2: NodeType = endNode.type;
    const usesStairs: boolean =
      nodeType1 === NodeType.STAI && nodeType2 == NodeType.STAI;
    const usesElevator: boolean =
      nodeType1 === NodeType.ELEV && nodeType2 == NodeType.ELEV;

    if (usesStairs || usesElevator) {
      result += 10;
    }

    this.ID = ID;
    this.startNode = startNode;
    this.endNode = endNode;
    this.weight = result;
  }

  private setWeight() {
    const [x1, y1] = this.startNode.getCoordinates();
    const [x2, y2] = this.endNode.getCoordinates();
    let result: number = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    if (this.changesFloor()) {
      result += 10;
    }
    return result;
  }

  public changesFloor(): boolean {
    return this.usesStairs() || this.useElevator();
  }

  public usesStairs(): boolean {
    const nodeType1: NodeType = this.getStartNode().getType();
    const nodeType2: NodeType = this.getEndNode().getType();
    return nodeType1 === NodeType.STAI && nodeType2 == NodeType.STAI;
  }

  public useElevator(): boolean {
    const nodeType1: NodeType = this.getStartNode().getType();
    const nodeType2: NodeType = this.getEndNode().getType();
    return nodeType1 === NodeType.ELEV && nodeType2 == NodeType.ELEV;
  }

  public getStartNode() {
    return this.startNode;
  }

  public getEndNode() {
    return this.endNode;
  }

  public getWeight(): number {
    return this.weight;
  }
}
