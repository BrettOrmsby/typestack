import { type StackFunctions } from "../functions.js";

const math: StackFunctions = {
  int: {
    abs: {
      params: { num: "int" },
      rawCode: (stacks, params) => {
        stacks.int.push(Math.abs(params.num));
      },
    },
    neg: {
      params: { num: "int" },
      rawCode: (stacks, params) => {
        stacks.int.push(-params.num);
      },
    },
  },
  float: {
    ceil: {
      params: { num: "float" },
      rawCode: (stacks, params) => {
        stacks.int.push(Math.ceil(params.num));
      },
    },
    floor: {
      params: { num: "float" },
      rawCode: (stacks, params) => {
        stacks.int.push(Math.floor(params.num));
      },
    },
    round: {
      params: { num: "float" },
      rawCode: (stacks, params) => {
        stacks.int.push(Math.round(params.num));
      },
    },
    abs: {
      params: { num: "float" },
      rawCode: (stacks, params) => {
        stacks.float.push(Math.abs(params.num));
      },
    },
    neg: {
      params: { num: "float" },
      rawCode: (stacks, params) => {
        stacks.float.push(-params.num);
      },
    },
  },
  str: {},
  bool: {},
  any: {},
};

export default math;
