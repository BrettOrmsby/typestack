import { type StackFunctions } from "../functions.js";
import { StackType } from "../stack.js";

const math: StackFunctions = {
  [StackType.Int]: {
    abs: {
      params: { num: StackType.Int },
      rawCode: (stacks, params) => {
        stacks[StackType.Int].push(Math.abs(params.num));
      },
    },
    neg: {
      params: { num: StackType.Int },
      rawCode: (stacks, params) => {
        stacks[StackType.Int].push(-params.num);
      },
    },
  },
  [StackType.Float]: {
    ceil: {
      params: { num: StackType.Float },
      rawCode: (stacks, params) => {
        stacks[StackType.Int].push(Math.ceil(params.num));
      },
    },
    floor: {
      params: { num: StackType.Float },
      rawCode: (stacks, params) => {
        stacks[StackType.Int].push(Math.floor(params.num));
      },
    },
    round: {
      params: { num: StackType.Float },
      rawCode: (stacks, params) => {
        stacks[StackType.Int].push(Math.round(params.num));
      },
    },
    abs: {
      params: { num: StackType.Float },
      rawCode: (stacks, params) => {
        stacks[StackType.Float].push(Math.abs(params.num));
      },
    },
    neg: {
      params: { num: StackType.Float },
      rawCode: (stacks, params) => {
        stacks[StackType.Float].push(-params.num);
      },
    },
  },
  [StackType.Str]: {},
  [StackType.Bool]: {},
  [StackType.Any]: {},
};

export default math;
