export class PriorityQueue<T> {
  private elements: [number, T][] = [];
  enqueue(priority: number, element: T): void {
    this.elements.push([priority, element]);
    this.elements.sort((a, b) => a[0] - b[0]);
  }

  dequeue(): T | undefined {
    return this.elements.shift()?.[1];
  }

  isEmpty(): boolean {
    return this.elements.length === 0;
  }
}
