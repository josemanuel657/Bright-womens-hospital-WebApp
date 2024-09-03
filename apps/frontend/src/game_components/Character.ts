export class Character {
  public name: string;
  public health: number;
  public speed: number;
  public size: number;
  public passive: string;
  public frames: Array<string>;
  public head: string;
  public role: string;
  public quote: string;
  public backstory: string;

  constructor(
    name: string,
    health: number,
    speed: number,
    size: number,
    passive: string,
    frames: Array<string>,
    head: string,
    role: string,
    quote: string,
    backstory: string,
  ) {
    this.name = name;
    this.health = health;
    this.speed = speed;
    this.size = size;
    this.frames = frames;
    this.head = head;
    this.passive = passive;
    this.role = role;
    this.backstory = backstory;
    this.quote = quote;
  }
}
