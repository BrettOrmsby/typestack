import { StackTypes, Stacks } from "./stack.js";
import { Program } from "./parse.js";
import * as readline from "readline";

export type StackFunction = {
  body?: Program;
  params: Record<string, StackTypes>;
  rawCode?: (
    stacks: Stacks,
    params: Record<string, any>,
    currentStack: StackTypes,
    consoleFunction: (string: string) => void
  ) => void | Error | Promise<void | Error>;
};

export type StackFunctions = {
  int: Record<string, StackFunction>;
  float: Record<string, StackFunction>;
  str: Record<string, StackFunction>;
  bool: Record<string, StackFunction>;
  any: Record<string, StackFunction>;
};

export function functionToText(
  name: string,
  stack: StackTypes,
  func: StackFunction
): string {
  const parameters = Object.keys(func.params).map(
    (e) => `${e}: ${func.params[e]}`
  );
  return `${name}(${parameters.join(" ")}) @${stack}`;
}

export const standardLibraryFunctions: StackFunctions = {
  int: {
    // comparison functions
    "<": {
      params: { right: "int", left: "int" },
      rawCode: (stacks, params) => {
        stacks.bool.push(params.left < params.right);
      },
    },
    ">": {
      params: { right: "int", left: "int" },
      rawCode: (stacks, params) => {
        stacks.bool.push(params.left > params.right);
      },
    },
    "<=": {
      params: { right: "int", left: "int" },
      rawCode: (stacks, params) => {
        stacks.bool.push(params.left <= params.right);
      },
    },
    ">=": {
      params: { right: "int", left: "int" },
      rawCode: (stacks, params) => {
        stacks.bool.push(params.left >= params.right);
      },
    },

    // math functions
    "+": {
      params: { right: "int", left: "int" },
      rawCode: (stacks, params) => {
        stacks.int.push(params.left + params.right);
      },
    },
    "-": {
      params: { right: "int", left: "int" },
      rawCode: (stacks, params) => {
        stacks.int.push(params.left - params.right);
      },
    },
    "*": {
      params: { right: "int", left: "int" },
      rawCode: (stacks, params) => {
        stacks.int.push(params.left * params.right);
      },
    },
    "/": {
      params: { right: "int", left: "int" },
      rawCode: (stacks, params) => {
        if (params.right === 0) {
          return new Error(
            "divide by zero. `/(right: int, left: int)` must have `right` parameter not equal to `0`"
          );
        }
        stacks.float.push(params.left / params.right);
      },
    },
    "//": {
      params: { right: "int", left: "int" },
      rawCode: (stacks, params) => {
        if (params.right === 0) {
          return new Error(
            "divide by zero. `//(right: int, left: int)` must have `right` parameter not equal to `0`"
          );
        }
        stacks.int.push(Math.floor(params.left / params.right));
      },
    },
    "%": {
      params: { right: "int", left: "int" },
      rawCode: (stacks, params) => {
        if (params.right === 0) {
          return new Error(
            "divide by zero. `%(right: int, left: int)` must have `right` parameter not equal to `0`"
          );
        }
        stacks.int.push(params.left % params.right);
      },
    },
    "^": {
      params: { right: "int", left: "int" },
      rawCode: (stacks, params) => {
        stacks.int.push(params.left ^ params.right);
      },
    },
    rand: {
      params: { max: "int", min: "int" },
      rawCode: (stacks, params) => {
        stacks.int.push(
          Math.floor(Math.random() * (params.max - params.min + 1)) + params.min
        );
      },
    },
  },
  float: {
    // comparison functions
    "<": {
      params: { right: "float", left: "float" },
      rawCode: (stacks, params) => {
        stacks.bool.push(params.left < params.right);
      },
    },
    ">": {
      params: { right: "float", left: "float" },
      rawCode: (stacks, params) => {
        stacks.bool.push(params.left > params.right);
      },
    },
    "<=": {
      params: { right: "float", left: "float" },
      rawCode: (stacks, params) => {
        stacks.bool.push(params.left <= params.right);
      },
    },
    ">=": {
      params: { right: "float", left: "float" },
      rawCode: (stacks, params) => {
        stacks.bool.push(params.left >= params.right);
      },
    },

    // math functions
    "+": {
      params: { right: "float", left: "float" },
      rawCode: (stacks, params) => {
        stacks.float.push(params.left + params.right);
      },
    },
    "-": {
      params: { right: "float", left: "float" },
      rawCode: (stacks, params) => {
        stacks.float.push(params.left - params.right);
      },
    },
    "*": {
      params: { right: "float", left: "float" },
      rawCode: (stacks, params) => {
        stacks.float.push(params.left * params.right);
      },
    },
    "/": {
      params: { right: "float", left: "float" },
      rawCode: (stacks, params) => {
        if (params.right === 0) {
          return new Error(
            "divide by zero. `/(right: float, left: float)` must have `right` parameter not equal to `0.0`"
          );
        }
        stacks.float.push(params.left / params.right);
      },
    },
    "//": {
      params: { right: "float", left: "float" },
      rawCode: (stacks, params) => {
        if (params.right === 0) {
          return new Error(
            "divide by zero. `//(right: float, left: float)` must have `right` parameter not equal to `0.0`"
          );
        }
        stacks.float.push(Math.floor(params.left * params.right));
      },
    },
    "%": {
      params: { right: "float", left: "float" },
      rawCode: (stacks, params) => {
        if (params.right === 0) {
          return new Error(
            "divide by zero. `%(right: float, left: float)` must have `right` parameter not equal to `0.0`"
          );
        }
        stacks.int.push(params.left % params.right);
      },
    },
    "^": {
      params: { right: "float", left: "float" },
      rawCode: (stacks, params) => {
        stacks.float.push(params.left ^ params.right);
      },
    },
  },
  str: {
    length: {
      params: { string: "str" },
      rawCode: (stacks, params) => {
        stacks.int.push(params.str.length);
      },
    },
    "+": {
      params: { right: "str", left: "str" },
      rawCode: (stacks, params) => {
        stacks.str.push(params.left + params.right);
      },
    },
  },
  bool: {
    // comparison functions
    "&": {
      params: { right: "bool", left: "bool" },
      rawCode: (stacks, params) => {
        stacks.bool.push(params.left && params.right);
      },
    },
    "|": {
      params: { right: "bool", left: "bool" },
      rawCode: (stacks, params) => {
        stacks.bool.push(params.left || params.right);
      },
    },
    "!": {
      params: { boolean: "bool" },
      rawCode: (stacks, params) => {
        stacks.bool.push(!params.boolean);
      },
    },
  },
  any: {
    // Word functions
    dup: {
      params: { first: "any" },
      rawCode: (stacks, params, stack) => {
        stacks[stack].push(params.first);
        stacks[stack].push(params.first);
      },
    },
    drop: {
      params: { first: "any" },
    },
    swap: {
      params: { first: "any", second: "any" },
      rawCode: (stacks, params, stack) => {
        stacks[stack].push(params.first);
        stacks[stack].push(params.second);
      },
    },
    over: {
      params: { first: "any", second: "any" },
      rawCode: (stacks, params, stack) => {
        stacks[stack].push(params.second);
        stacks[stack].push(params.first);
        stacks[stack].push(params.second);
      },
    },
    rot: {
      params: {
        first: "any",
        second: "any",
        third: "any",
      },
      rawCode: (stacks, params, stack) => {
        stacks[stack].push(params.second);
        stacks[stack].push(params.first);
        stacks[stack].push(params.third);
      },
    },
    print: {
      params: { item: "any" },
      rawCode: (stacks, params, stack, consoleFunc) => {
        if (stack === "float" && !params.item.toString().includes(".")) {
          params.item = params.item.toFixed(1);
        }
        consoleFunc(params.item.toString());
        stacks[stack].push(params.item);
      },
    },
    read: {
      params: { prompt: "str" },
      rawCode: async (stacks, params, stack) => {
        // does not work on browser
        if (window !== undefined) {
          return;
        }
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });
        const answer: string = await new Promise((resolve) => {
          rl.question(params.prompt, resolve);
        });
        rl.close();

        if (stack === "str") {
          stacks[stack].push(answer);
        } else if (stack === "bool") {
          if (answer.trim() === "true") {
            stacks[stack].push(true);
          } else if (answer.trim() === "false") {
            stacks[stack].push(false);
          } else {
            return new Error(
              `invalid input for type \`${stack}\`: \`${answer}\``
            );
          }
        } else {
          // int or float
          const isFloat = stack === "float";
          let isInDecimal = false;
          for (const char of answer.trim().split("")) {
            if (char === ".") {
              if (isInDecimal || !isFloat) {
                return new Error(
                  `invalid input for type \`${stack}\`: \`${answer}\``
                );
              } else {
                isInDecimal = true;
                continue;
              }
            }
            if (!(char >= "0" && char <= "9")) {
              return new Error(
                `invalid input for type \`${stack}\`: \`${answer}\``
              );
            }
          }
          if (isFloat) {
            stacks[stack].push(parseFloat(answer));
          } else {
            stacks[stack].push(parseInt(answer));
          }
        }
      },
    },

    // comparison functions
    "==": {
      params: { right: "any", left: "any" },
      rawCode: (stacks, params) => {
        stacks.bool.push(params.left === params.right);
      },
    },
    "!=": {
      params: { right: "any", left: "any" },
      rawCode: (stacks, params) => {
        stacks.bool.push(params.left !== params.right);
      },
    },

    // conversion functions
    toStr: {
      params: { item: "any" },
      rawCode: (stacks, params, stack) => {
        if (stack === "float" && !params.item.toString().includes(".")) {
          params.item = params.item.toFixed(1);
        }

        stacks.str.push(params.item.toString());
      },
    },
    toBool: {
      params: { item: "any" },
      rawCode: (stacks, params) => {
        stacks.bool.push(!!params.item);
      },
    },
    toInt: {
      params: { item: "any" },
      rawCode: (stacks, params, stack) => {
        let int: number;
        if (stack === "int") {
          int = params.item;
        } else if (stack === "float") {
          int = Math.trunc(params.item);
        } else if (stack === "bool") {
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
        stacks.int.push(int);
      },
    },
    toFloat: {
      params: { item: "any" },
      rawCode: (stacks, params, stack) => {
        let float: number;
        if (stack === "float" || stack === "int") {
          float = params.item;
        } else if (stack === "bool") {
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
        stacks.float.push(float);
      },
    },
  },
};
