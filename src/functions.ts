//TODO: Type conversion functions
import { StackType, Stacks } from "./stack.js";
import { Program } from "./parse.js";

export type StackFunction = {
    body?: Program,
    params: Record<string, StackType>,
    rawCode?: (s: Stacks, p: Record<string, any>, c: StackType) => void
}

export type StackFunctions = {
    [StackType.Int]: Record<string, StackFunction>;
    [StackType.Float]: Record<string, StackFunction>;
    [StackType.Str]: Record<string, StackFunction>;
    [StackType.Bool]: Record<string, StackFunction>;
    [StackType.Any]: Record<string, StackFunction>;
}

export const standardLibraryFunctions: StackFunctions = {
    [StackType.Int]: {
        // comparison functions
        "<": {
            params: { right: StackType.Int, left: StackType.Int },
            rawCode: (stacks, params) => {
                stacks[StackType.Bool].push(params.left < params.right);
            }
        },
        ">": {
            params: { right: StackType.Int, left: StackType.Int },
            rawCode: (stacks, params) => {
                stacks[StackType.Bool].push(params.left > params.right);
            }
        },
        "<=": {
            params: { right: StackType.Int, left: StackType.Int },
            rawCode: (stacks, params) => {
                stacks[StackType.Bool].push(params.left <= params.right);
            }
        },
        ">=": {
            params: { right: StackType.Int, left: StackType.Int },
            rawCode: (stacks, params) => {
                stacks[StackType.Bool].push(params.left >= params.right);
            }
        },

        // math functions
        "+": {
            params: { right: StackType.Int, left: StackType.Int },
            rawCode: (stacks, params) => {
                stacks[StackType.Int].push(params.left + params.right);
            }
        },
        "-": {
            params: { right: StackType.Int, left: StackType.Int },
            rawCode: (stacks, params) => {
                stacks[StackType.Int].push(params.left - params.right);
            }
        },
        "*": {
            params: { right: StackType.Int, left: StackType.Int },
            rawCode: (stacks, params) => {
                stacks[StackType.Int].push(params.left * params.right);
            }
        },
        "/": {
            params: { right: StackType.Int, left: StackType.Int },
            rawCode: (stacks, params) => {
                if(params.left === 0) {
                    return new Error("Divide by zero. `/(right: int, left: int)` must have `right` parameter not equal to `0`");
                }
                stacks[StackType.Float].push(params.left / params.right);
            }
        },
        "//": {
            params: { right: StackType.Int, left: StackType.Int },
            rawCode: (stacks, params) => {
                if(params.left === 0) {
                    return new Error("Divide by zero. `//(right: int, left: int)` must have `right` parameter not equal to `0`");
                }
                stacks[StackType.Int].push(Math.floor(params.left / params.right));
            }
        },
        "%": {
            params: { right: StackType.Int, left: StackType.Int },
            rawCode: (stacks, params) => {
                if(params.left === 0) {
                    return new Error("Divide by zero. `%(right: int, left: int)` must have `right` parameter not equal to `0`");
                }
                stacks[StackType.Int].push(params.left % params.right);
            }
        },
        "^": {
            params: { right: StackType.Int, left: StackType.Int },
            rawCode: (stacks, params) => {
                stacks[StackType.Int].push(params.left ^ params.right);
            }
        },
    },
    [StackType.Float]: {
        // comparison functions
        "<": {
            params: { right: StackType.Float, left:  StackType.Float},
            rawCode: (stacks, params) => {
                stacks[StackType.Bool].push(params.left < params.right);
            }
        },
        ">": {
            params: { right: StackType.Float, left: StackType.Float },
            rawCode: (stacks, params) => {
                stacks[StackType.Bool].push(params.left > params.right);
            }
        },
        "<=": {
            params: { right: StackType.Float, left: StackType.Float },
            rawCode: (stacks, params) => {
                stacks[StackType.Bool].push(params.left <= params.right);
            }
        },
        ">=": {
            params: { right: StackType.Float, left: StackType.Float },
            rawCode: (stacks, params) => {
                stacks[StackType.Bool].push(params.left >= params.right);
            }
        },

        // math functions
        "+": {
            params: { right: StackType.Float, left: StackType.Float },
            rawCode: (stacks, params) => {
                stacks[StackType.Float].push(params.left + params.right);
            }
        },
        "-": {
            params: { right: StackType.Float, left: StackType.Float },
            rawCode: (stacks, params) => {
                stacks[StackType.Float].push(params.left - params.right);
            }
        },
        "*": {
            params: { right: StackType.Float, left: StackType.Float },
            rawCode: (stacks, params) => {
                stacks[StackType.Float].push(params.left * params.right);
            }
        },
        "/": {
            params: { right: StackType.Float, left: StackType.Float },
            rawCode: (stacks, params) => {
                if(params.left === 0) {
                    return new Error("Divide by zero. `/(right: float, left: float)` must have `right` parameter not equal to `0.0`");
                }
                stacks[StackType.Float].push(params.left / params.right);
            }
        },
        "//": {
            params: { right: StackType.Float, left: StackType.Float },
            rawCode: (stacks, params) => {
                if(params.left === 0) {
                    return new Error("Divide by zero. `//(right: float, left: float)` must have `right` parameter not equal to `0.0`");
                }
                stacks[StackType.Float].push(Math.floor(params.left * params.right));
            }
        },
        "%": {
            params: { right: StackType.Float, left: StackType.Float },
            rawCode: (stacks, params) => {
                if(params.left === 0) {
                    return new Error("Divide by zero. `%(right: float, left: float)` must have `right` parameter not equal to `0.0`");
                }
                stacks[StackType.Int].push(params.left % params.right);
            }
        },
        "^": {
            params: { right: StackType.Float, left: StackType.Float },
            rawCode: (stacks, params) => {
                stacks[StackType.Float].push(params.left ^ params.right);
            }
        },
    },
    [StackType.Str]: {
        "length": {
            params: { str: StackType.Str },
            rawCode: (stacks, params) => {
                stacks[StackType.Int].push(params.str.length);
            }
        },
        "+": {
            params: { right: StackType.Str, left: StackType.Str },
            rawCode: (stacks, params) => {
                stacks[StackType.Str].push(params.left + params.right);
            }
        },
    },
    [StackType.Bool]: {
        // comparison functions
        "&": {
            params: { right: StackType.Bool, left: StackType.Bool },
            rawCode: (stacks, params) => {
                stacks[StackType.Bool].push(params.left && params.right);
            }
        },
        "|": {
            params: { right: StackType.Bool, left: StackType.Bool },
            rawCode: (stacks, params) => {
                stacks[StackType.Bool].push(params.left || params.right);
            }
        },
        "!": {
            params: { right: StackType.Bool },
            rawCode: (stacks, params) => {
                stacks[StackType.Bool].push(!params.right);
            }
        },
    },
    [StackType.Any]: {
        // Word functions
        "dup": {
            params: { t: StackType.Any },
            rawCode: (stacks, params, stack) => {
                stacks[stack].push(params.t);
                stacks[stack].push(params.t);
            }
        },
        "drop": {
            params: { t: StackType.Any },
        },
        "swap": {
            params: { first: StackType.Any, second: StackType.Any },
            rawCode: (stacks, params, stack) => {
                stacks[stack].push(params.first);
                stacks[stack].push(params.second);
            }
        },
        "over": {
            params: { first: StackType.Any, second: StackType.Any },
            rawCode: (stacks, params, stack) => {
                stacks[stack].push(params.second);
                stacks[stack].push(params.first);
                stacks[stack].push(params.second);
            }
        },
        "rot": {
            params: { first: StackType.Any, second: StackType.Any, third: StackType.Any },
            rawCode: (stacks, params, stack) => {
                stacks[stack].push(params.second);
                stacks[stack].push(params.first);
                stacks[stack].push(params.third);
            }
        },
        "print": {
            params: { t: StackType.Any },
            rawCode: (_stacks, params) => {
                console.log(params.t);
            }
        },

        // comparison functions
        "==": {
            params: { right: StackType.Any, left: StackType.Any },
            rawCode: (stacks, params) => {
                stacks[StackType.Bool].push(params.left === params.right);
            }
        },
        "!=": {
            params: { right: StackType.Any, left: StackType.Any },
            rawCode: (stacks, params) => {
                stacks[StackType.Bool].push(params.left !== params.right);
            }
        },
    }
};