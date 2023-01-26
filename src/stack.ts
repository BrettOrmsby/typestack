export const stackTypes = ["int", "float", "str", "bool", "any"] as const;

export type StackTypes = typeof stackTypes[number];

export class Stack<T> {
  stack: T[];

  constructor() {
    this.stack = [];
  }

  push(t: T) {
    this.stack.push(t);
  }

  get(): T {
    return this.stack.pop();
  }
  check(): boolean {
    return this.stack.length !== 0;
  }
  peek(): T {
    return this.stack[this.stack.length - 1];
  }
}

export type Stacks = {
  int: Stack<number>;
  float: Stack<number>;
  str: Stack<string>;
  bool: Stack<boolean>;
};

export const stacks: Stacks = {
  int: new Stack(),
  float: new Stack(),
  str: new Stack(),
  bool: new Stack(),
};
