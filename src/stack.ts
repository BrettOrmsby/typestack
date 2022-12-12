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
        this.push(t);
    }

    get(): T | Error {
        if(this.stack.length === 0) {
            return Error("Attempt to get a value off the stack failed");
        }
        return this.stack.pop();
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
