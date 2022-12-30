import { StackType, Stacks } from "./stack.js";
import { Program } from "./parse.js";

export type StackFunction = {
  body?: Program;
  params: Record<string, StackType>;
  rawCode?: (s: Stacks, p: Record<string, any>, c: StackType) => void | Error;
};

export type StackFunctions = {
  [StackType.Int]: Record<string, StackFunction>;
  [StackType.Float]: Record<string, StackFunction>;
  [StackType.Str]: Record<string, StackFunction>;
  [StackType.Bool]: Record<string, StackFunction>;
  [StackType.Any]: Record<string, StackFunction>;
};

export function functionToText(
  name: string,
  stack: StackType,
  func: StackFunction
): string {
  const parameters = Object.keys(func.params).map(
    (e) => `${e}: ${func.params[e]}`
  );
  return `${name}(${parameters.join(" ")}) @${stack}`;
}

export const standardLibraryFunctions: StackFunctions = {
  [StackType.Int]: {
    // comparison functions
    "<": {
      params: { right: StackType.Int, left: StackType.Int },
      rawCode: (stacks, params) => {
        stacks[StackType.Bool].push(params.left < params.right);
      },
    },
    ">": {
      params: { right: StackType.Int, left: StackType.Int },
      rawCode: (stacks, params) => {
        stacks[StackType.Bool].push(params.left > params.right);
      },
    },
    "<=": {
      params: { right: StackType.Int, left: StackType.Int },
      rawCode: (stacks, params) => {
        stacks[StackType.Bool].push(params.left <= params.right);
      },
    },
    ">=": {
      params: { right: StackType.Int, left: StackType.Int },
      rawCode: (stacks, params) => {
        stacks[StackType.Bool].push(params.left >= params.right);
      },
    },

    // math functions
    "+": {
      params: { right: StackType.Int, left: StackType.Int },
      rawCode: (stacks, params) => {
        stacks[StackType.Int].push(params.left + params.right);
      },
    },
    "-": {
      params: { right: StackType.Int, left: StackType.Int },
      rawCode: (stacks, params) => {
        stacks[StackType.Int].push(params.left - params.right);
      },
    },
    "*": {
      params: { right: StackType.Int, left: StackType.Int },
      rawCode: (stacks, params) => {
        stacks[StackType.Int].push(params.left * params.right);
      },
    },
    "/": {
      params: { right: StackType.Int, left: StackType.Int },
      rawCode: (stacks, params) => {
        if (params.right === 0) {
          return new Error(
            "divide by zero. `/(right: int, left: int)` must have `right` parameter not equal to `0`"
          );
        }
        stacks[StackType.Float].push(params.left / params.right);
      },
    },
    "//": {
      params: { right: StackType.Int, left: StackType.Int },
      rawCode: (stacks, params) => {
        if (params.right === 0) {
          return new Error(
            "divide by zero. `//(right: int, left: int)` must have `right` parameter not equal to `0`"
          );
        }
        stacks[StackType.Int].push(Math.floor(params.left / params.right));
      },
    },
    "%": {
      params: { right: StackType.Int, left: StackType.Int },
      rawCode: (stacks, params) => {
        if (params.right === 0) {
          return new Error(
            "divide by zero. `%(right: int, left: int)` must have `right` parameter not equal to `0`"
          );
        }
        stacks[StackType.Int].push(params.left % params.right);
      },
    },
    "^": {
      params: { right: StackType.Int, left: StackType.Int },
      rawCode: (stacks, params) => {
        stacks[StackType.Int].push(params.left ^ params.right);
      },
    },
    rand: {
      params: { max: StackType.Int, min: StackType.Int },
      rawCode: (stacks, params) => {
        stacks[StackType.Int].push(
          Math.floor(Math.random() * (params.max - params.min + 1)) + params.min
        );
      },
    },
  },
  [StackType.Float]: {
    // comparison functions
    "<": {
      params: { right: StackType.Float, left: StackType.Float },
      rawCode: (stacks, params) => {
        stacks[StackType.Bool].push(params.left < params.right);
      },
    },
    ">": {
      params: { right: StackType.Float, left: StackType.Float },
      rawCode: (stacks, params) => {
        stacks[StackType.Bool].push(params.left > params.right);
      },
    },
    "<=": {
      params: { right: StackType.Float, left: StackType.Float },
      rawCode: (stacks, params) => {
        stacks[StackType.Bool].push(params.left <= params.right);
      },
    },
    ">=": {
      params: { right: StackType.Float, left: StackType.Float },
      rawCode: (stacks, params) => {
        stacks[StackType.Bool].push(params.left >= params.right);
      },
    },

    // math functions
    "+": {
      params: { right: StackType.Float, left: StackType.Float },
      rawCode: (stacks, params) => {
        stacks[StackType.Float].push(params.left + params.right);
      },
    },
    "-": {
      params: { right: StackType.Float, left: StackType.Float },
      rawCode: (stacks, params) => {
        stacks[StackType.Float].push(params.left - params.right);
      },
    },
    "*": {
      params: { right: StackType.Float, left: StackType.Float },
      rawCode: (stacks, params) => {
        stacks[StackType.Float].push(params.left * params.right);
      },
    },
    "/": {
      params: { right: StackType.Float, left: StackType.Float },
      rawCode: (stacks, params) => {
        if (params.right === 0) {
          return new Error(
            "divide by zero. `/(right: float, left: float)` must have `right` parameter not equal to `0.0`"
          );
        }
        stacks[StackType.Float].push(params.left / params.right);
      },
    },
    "//": {
      params: { right: StackType.Float, left: StackType.Float },
      rawCode: (stacks, params) => {
        if (params.right === 0) {
          return new Error(
            "divide by zero. `//(right: float, left: float)` must have `right` parameter not equal to `0.0`"
          );
        }
        stacks[StackType.Float].push(Math.floor(params.left * params.right));
      },
    },
    "%": {
      params: { right: StackType.Float, left: StackType.Float },
      rawCode: (stacks, params) => {
        if (params.right === 0) {
          return new Error(
            "divide by zero. `%(right: float, left: float)` must have `right` parameter not equal to `0.0`"
          );
        }
        stacks[StackType.Int].push(params.left % params.right);
      },
    },
    "^": {
      params: { right: StackType.Float, left: StackType.Float },
      rawCode: (stacks, params) => {
        stacks[StackType.Float].push(params.left ^ params.right);
      },
    },
  },
  [StackType.Str]: {
    length: {
      params: { string: StackType.Str },
      rawCode: (stacks, params) => {
        stacks[StackType.Int].push(params.str.length);
      },
    },
    "+": {
      params: { right: StackType.Str, left: StackType.Str },
      rawCode: (stacks, params) => {
        stacks[StackType.Str].push(params.left + params.right);
      },
    },
  },
  [StackType.Bool]: {
    // comparison functions
    "&": {
      params: { right: StackType.Bool, left: StackType.Bool },
      rawCode: (stacks, params) => {
        stacks[StackType.Bool].push(params.left && params.right);
      },
    },
    "|": {
      params: { right: StackType.Bool, left: StackType.Bool },
      rawCode: (stacks, params) => {
        stacks[StackType.Bool].push(params.left || params.right);
      },
    },
    "!": {
      params: { boolean: StackType.Bool },
      rawCode: (stacks, params) => {
        stacks[StackType.Bool].push(!params.boolean);
      },
    },
  },
  [StackType.Any]: {
    // Word functions
    dup: {
      params: { first: StackType.Any },
      rawCode: (stacks, params, stack) => {
        stacks[stack].push(params.first);
        stacks[stack].push(params.first);
      },
    },
    drop: {
      params: { first: StackType.Any },
    },
    swap: {
      params: { first: StackType.Any, second: StackType.Any },
      rawCode: (stacks, params, stack) => {
        stacks[stack].push(params.first);
        stacks[stack].push(params.second);
      },
    },
    over: {
      params: { first: StackType.Any, second: StackType.Any },
      rawCode: (stacks, params, stack) => {
        stacks[stack].push(params.second);
        stacks[stack].push(params.first);
        stacks[stack].push(params.second);
      },
    },
    rot: {
      params: {
        first: StackType.Any,
        second: StackType.Any,
        third: StackType.Any,
      },
      rawCode: (stacks, params, stack) => {
        stacks[stack].push(params.second);
        stacks[stack].push(params.first);
        stacks[stack].push(params.third);
      },
    },
    print: {
      params: { item: StackType.Any },
      rawCode: (stacks, params, stack) => {
        if (
          stack === StackType.Float &&
          !params.item.toString().includes(".")
        ) {
          params.item = params.item.toFixed(1);
        }
        console.log(params.item.toString());
        stacks[stack].push(params.item);
      },
    },

    // comparison functions
    "==": {
      params: { right: StackType.Any, left: StackType.Any },
      rawCode: (stacks, params) => {
        stacks[StackType.Bool].push(params.left === params.right);
      },
    },
    "!=": {
      params: { right: StackType.Any, left: StackType.Any },
      rawCode: (stacks, params) => {
        stacks[StackType.Bool].push(params.left !== params.right);
      },
    },

    // conversion functions
    toStr: {
      params: { item: StackType.Any },
      rawCode: (stacks, params, stack) => {
        if (
          stack === StackType.Float &&
          !params.item.toString().includes(".")
        ) {
          params.item = params.item.toFixed(1);
        }

        stacks[StackType.Str].push(params.item.toString());
      },
    },
    toBool: {
      params: { item: StackType.Any },
      rawCode: (stacks, params) => {
        stacks[StackType.Bool].push(!!params.item);
      },
    },
    toInt: {
      params: { item: StackType.Any },
      rawCode: (stacks, params, stack) => {
        let int: number;
        if (stack === StackType.Int) {
          int = params.item;
        } else if (stack === StackType.Float) {
          int = Math.trunc(params.item);
        } else if (stack === StackType.Bool) {
          int = params.item ? 1 : 0;
        } else {
          for (const char of params.item.split("")) {
            if (!(char >= "0" && char <= "9")) {
              return new Error(
                `unable to convert \`str\` to \`int\`: \`${params.item}\``
              );
            }
          }
          int = parseInt(params.item);
        }
        stacks[StackType.Int].push(int);
      },
    },
    toFloat: {
      params: { item: StackType.Any },
      rawCode: (stacks, params, stack) => {
        let float: number;
        if (stack === StackType.Float || stack === StackType.Int) {
          float = params.item;
        } else if (stack === StackType.Bool) {
          float = params.item ? 1 : 0;
        } else {
          let isInDecimal = false;
          for (const char of params.item.split("")) {
            if (char === ".") {
              if (isInDecimal) {
                return new Error(
                  `unable to convert \`str\` to \`float\`: \`${params.item}\``
                );
              } else {
                isInDecimal = true;
                continue;
              }
            }
            if (!(char >= "0" && char <= "9")) {
              return new Error(
                `unable to convert \`str\` to \`float\`: \`${params.item}\``
              );
            }
          }
          float = parseFloat(params.item);
        }
        stacks[StackType.Float].push(float);
      },
    },
  },
};
