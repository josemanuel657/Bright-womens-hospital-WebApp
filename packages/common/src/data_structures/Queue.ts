export class Queue<T> {
  private elements: Array<T> = new Array<T>();

  public enqueue(element: T) {
    this.elements.push(element);
  }

  public dequeue(): T | undefined {
    return this.elements.shift();
  }

  public peek(): T | undefined {
    return this.elements[0];
  }

  public isEmpty(): boolean {
    return this.elements.length === 0;
  }

  public size(): number {
    return this.elements.length;
  }
}
