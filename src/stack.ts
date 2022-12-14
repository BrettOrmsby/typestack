export enum StackType {
    Int = "int",
    Float = "float",
    Str = "str",
    Bool = "bool",
    Any = "any"
}

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
        return this.stack[this.stack.length-1];
    }
}

export type Stacks = {
    [StackType.Int]: Stack<number>
    [StackType.Float]: Stack<number>
    [StackType.Str]: Stack<string>
    [StackType.Bool]: Stack<boolean>
}

export const stacks: Stacks = {
    [StackType.Int]: new Stack(),
    [StackType.Float]: new Stack(),
    [StackType.Str]: new Stack(),
    [StackType.Bool]: new Stack()
};
