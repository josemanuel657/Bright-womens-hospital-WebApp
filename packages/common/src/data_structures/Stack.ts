export class Stack<T> {
  private elements: Array<T> = new Array<T>();

  public push(element: T) {
    this.elements.push(element);
  }

  public pop(): T | undefined {
    return this.elements.pop();
  }

  public peek(): T | undefined {
    return this.elements[this.elements.length - 1];
  }

  public isEmpty(): boolean {
    return this.elements.length === 0;
  }

  public size(): number {
    return this.elements.length;
  }

  public reverse(): void {
    this.elements.reverse();
  }

  public toArray(): Array<T> {
    return this.elements;
  }
}
