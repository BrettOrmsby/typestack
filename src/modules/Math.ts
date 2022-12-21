import { type StackFunctions } from "../functions.js";
import { StackType } from "../stack.js";

const math: StackFunctions = {
  [StackType.Int]: {
    squareRoot: {
      params: { num: StackType.Int },
      rawCode: (stacks, params) => {
        if (params.num < 0) {
          return new Error(
            "cannot square root a negative number `squareRoot(num: int)` must have `num` parameter greater or equal to `0`"
          );
        }
        stacks[StackType.Float].push(Math.sqrt(params.num));
      },
    },
  },
  [StackType.Float]: {
    squareRoot: {
      params: { num: StackType.Int },
      rawCode: (stacks, params) => {
        if (params.num < 0) {
          return new Error(
            "cannot square root a negative number `squareRoot(num: float)` must have `num` parameter greater or equal to `0.0`"
          );
        }
        stacks[StackType.Float].push(Math.sqrt(params.num));
      },
    },
  },
  [StackType.Str]: {},
  [StackType.Bool]: {},
  [StackType.Any]: {},
};

export default math;
