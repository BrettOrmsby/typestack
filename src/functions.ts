import { StackType, Stacks } from "./stack.js";
import { Program } from "./parse.js";

export type StackFunction = {
    // will not need this
    stack: StackType,
    body?: Program,
    params: Record<string, StackType>,
    rawCode?: (s: Stacks, p: Record<string, any>, c: StackType) => void
}

export const standardLibraryFunctions: Record<string, StackFunction> = {
    "dup": {
        stack: StackType.Any,
        params: { t: StackType.Any },
        rawCode: (stacks, params, stack) => {
            stacks[stack].push(params.t);
            stacks[stack].push(params.t);
        }
    },
    "drop": {
        stack: StackType.Any,
        params: { t: StackType.Any },
    },
    "print": {
        stack: StackType.Any,
        params: { t: StackType.Any },
        rawCode: (_stacks, params) => {
            console.log(params.t);
        }
    },
    

    "%": {
        stack: StackType.Int,
        params: { t: StackType.Int, t2: StackType.Int },
        rawCode: (stacks, params) => {
            stacks[StackType.Int].push(params.t2 % params.t);
        }
    },
    "==": {
        stack: StackType.Int,
        params: { t: StackType.Int, t2: StackType.Int },
        rawCode: (stacks, params) => {
            stacks[StackType.Bool].push(params.t2 === params.t);
        }
    }
};