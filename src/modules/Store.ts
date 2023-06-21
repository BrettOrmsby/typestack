import { type StackFunctions } from "../functions.js";

type storageValue =
  | { type: "str"; value: string }
  | { type: "int"; value: number }
  | { type: "float"; value: number }
  | { type: "bool"; value: boolean };
const storage: Map<string, storageValue> = new Map();

const store: StackFunctions = {
  int: {},
  float: {},
  str: {
    get: {
      params: { key: "str" },
      rawCode: (stacks, params) => {
        const value = storage.get(params.key);
        if (value === undefined) {
          return new Error(
            "value not found. `Store.get(key: str)` must have a value stored at the key: `" +
              params.key +
              "`"
          );
        } else if (value.type === "str") {
          stacks.str.push(value.value);
        } else if (value.type === "bool") {
          stacks.bool.push(value.value);
        } else if (value.type === "int") {
          stacks.int.push(value.value);
        } else {
          stacks.float.push(value.value);
        }
      },
    },
    has: {
      params: {
        key: "str",
      },
      rawCode: (stacks, params) => {
        if (storage.get(params.key) === undefined) {
          stacks.bool.push(false);
        } else {
          stacks.bool.push(true);
        }
      },
    },
    remove: {
      params: { key: "str" },
      rawCode: (_stacks, params) => {
        storage.delete(params.key);
      },
    },
  },
  bool: {},
  any: {
    set: {
      params: { value: "any", key: "str" },
      rawCode: (_stacks, params, currentStack) => {
        storage.set(params.key, {
          type: currentStack as "int" | "float" | "str" | "bool",
          value: params.value,
        });
      },
    },
  },
};

export default store;
