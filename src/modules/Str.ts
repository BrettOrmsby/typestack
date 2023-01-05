import { type StackFunctions } from "../functions.js";
import { StackType } from "../stack.js";

const str: StackFunctions = {
  [StackType.Int]: {
    fromCharCode: {
      params: { code: StackType.Int },
      rawCode: (stacks, params) => {
        stacks[StackType.Str].push(String.fromCharCode(params.code));
      },
    },
    fromCodePoint: {
      params: { code: StackType.Int },
      rawCode: (stacks, params) => {
        let char: string;
        try {
          char = String.fromCharCode(params.code);
        } catch (e) {
          return new Error(
            `\`code\` is an invalid code point: \`${params.code}\``
          );
        }
        stacks[StackType.Str].push(char);
      },
    },
    repeat: {
      params: { string: StackType.Str, amount: StackType.Int },
      rawCode: (stacks, params) => {
        if (params.amount < 0) {
          return new Error(
            `unable to repeat a negative \`amount\`: \`${params.amount}\``
          );
        }
        stacks[StackType.Str].push(params.string.repeat(params.amount));
      },
    },
    charAt: {
      params: { string: StackType.Str, index: StackType.Int },
      rawCode: (stacks, params) => {
        stacks[StackType.Str].push(params.string.charAt(params.index));
      },
    },
    charCodeAt: {
      params: { string: StackType.Str, index: StackType.Int },
      rawCode: (stacks, params) => {
        const code = params.string.charCodeAt(params.index);
        if (isNaN(code)) {
          return new Error(
            `\`index\` out of range: \`"${params.string}"\`, \`${params.index}\``
          );
        }
        stacks[StackType.Int].push(code);
      },
    },
    codePointAt: {
      params: { string: StackType.Str, index: StackType.Int },
      rawCode: (stacks, params) => {
        const code = params.string.codePointAt(params.index);
        if (!code) {
          return new Error(
            `\`index\` out of range: \`"${params.string}"\`, \`${params.index}\``
          );
        }
        stacks[StackType.Int].push(code);
      },
    },
    slice: {
      params: {
        string: StackType.Str,
        endIndex: StackType.Int,
        startIndex: StackType.Int,
      },
      rawCode: (stacks, params) => {
        stacks[StackType.Str].push(
          params.string.slice(params.startIndex, params.endIndex)
        );
      },
    },
  },
  [StackType.Float]: {},
  [StackType.Str]: {
    endsWith: {
      params: { end: StackType.Str, string: StackType.Str },
      rawCode: (stacks, params) => {
        stacks[StackType.Bool].push(params.string.endsWith(params.end));
      },
    },
    startsWith: {
      params: { start: StackType.Str, string: StackType.Str },
      rawCode: (stacks, params) => {
        stacks[StackType.Bool].push(params.string.startsWith(params.start));
      },
    },
    includes: {
      params: { search: StackType.Str, string: StackType.Str },
      rawCode: (stacks, params) => {
        stacks[StackType.Bool].push(params.string.includes(params.search));
      },
    },
    occurrence: {
      params: { search: StackType.Str, string: StackType.Str },
      rawCode: (stacks, params) => {
        stacks[StackType.Int].push(
          params.string.split(params.search).length - 1
        );
      },
    },
    toUpper: {
      params: { string: StackType.Str },
      rawCode: (stacks, params) => {
        stacks[StackType.Str].push(params.string.toUpperCase());
      },
    },
    toLower: {
      params: { string: StackType.Str },
      rawCode: (stacks, params) => {
        stacks[StackType.Str].push(params.string.toLowerCase());
      },
    },
    trim: {
      params: { string: StackType.Str },
      rawCode: (stacks, params) => {
        stacks[StackType.Str].push(params.string.trim());
      },
    },
    reverse: {
      params: { string: StackType.Str },
      rawCode: (stacks, params) => {
        stacks[StackType.Str].push(params.string.split("").reverse().join(""));
      },
    },
    replace: {
      params: {
        replacement: StackType.Str,
        search: StackType.Str,
        string: StackType.Str,
      },
      rawCode: (stacks, params) => {
        stacks[StackType.Str].push(
          params.string.replace(params.search, params.replacement)
        );
      },
    },
    replaceAll: {
      params: {
        replacement: StackType.Str,
        search: StackType.Str,
        string: StackType.Str,
      },
      rawCode: (stacks, params) => {
        stacks[StackType.Str].push(
          params.string.replaceAll(params.search, params.replacement)
        );
      },
    },
    repeat: {
      params: { string: StackType.Str, amount: StackType.Int },
      rawCode: (stacks, params) => {
        if (params.amount < 0) {
          return new Error(
            `unable to repeat a negative \`amount\`: \`${params.amount}\``
          );
        }
        stacks[StackType.Str].push(params.string.repeat(params.amount));
      },
    },
    indexOf: {
      params: { search: StackType.Str, string: StackType.Str },
      rawCode: (stacks, params) => {
        stacks[StackType.Int].push(params.string.indexOf(params.search));
      },
    },
    lastIndexOf: {
      params: { search: StackType.Str, string: StackType.Str },
      rawCode: (stacks, params) => {
        stacks[StackType.Int].push(params.string.lastIndexOf(params.search));
      },
    },
    charAt: {
      params: { string: StackType.Str, index: StackType.Int },
      rawCode: (stacks, params) => {
        stacks[StackType.Str].push(params.string.charAt(params.index));
      },
    },
    charCodeAt: {
      params: { string: StackType.Str, index: StackType.Int },
      rawCode: (stacks, params) => {
        const code = params.string.charCodeAt(params.index);
        if (isNaN(code)) {
          return new Error(
            `\`index\` out of range: \`"${params.string}"\`, \`${params.index}\``
          );
        }
        stacks[StackType.Int].push(code);
      },
    },
    codePointAt: {
      params: { string: StackType.Str, index: StackType.Int },
      rawCode: (stacks, params) => {
        const code = params.string.codePointAt(params.index);
        if (!code) {
          return new Error(
            `\`index\` out of range: \`"${params.string}"\`, \`${params.index}\``
          );
        }
        stacks[StackType.Int].push(code);
      },
    },
    slice: {
      params: {
        string: StackType.Str,
        endIndex: StackType.Int,
        startIndex: StackType.Int,
      },
      rawCode: (stacks, params) => {
        stacks[StackType.Str].push(
          params.string.slice(params.startIndex, params.endIndex)
        );
      },
    },
    split: {
      params: { separator: StackType.Str, string: StackType.Str },
      rawCode: (stacks, params) => {
        params.string
          .split(params.separator)
          .forEach((e) => stacks[StackType.Str].push(e));
      },
    },
  },
  [StackType.Bool]: {},
  [StackType.Any]: {},
};

export default str;
