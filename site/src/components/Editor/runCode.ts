import typestack from "typestack-lang/dist/index";
import type { StackFunctions } from "typestack-lang/dist/functions";

import math from "typestack-lang/dist/modules/Math";
import date from "typestack-lang/dist/modules/Date";
import str from "typestack-lang/dist/modules/Str";

import {
  consoleEffect,
  ConsoleEffects,
} from "typestack-lang/dist/utils/consoleEffect";

const functions: StackFunctions = {
  int: {},
  float: {},
  str: {},
  bool: {},
  any: {
    read: {
      params: {},
      rawCode: (_stacks, _params, _type, consoleFunc) => {
        consoleFunc(
          `${consoleEffect(
            "Warning",
            ConsoleEffects.FgYellow,
            ConsoleEffects.Bright
          )}:${consoleEffect(
            "`read(prompt: str) @any` does not work in the browser",
            ConsoleEffects.Bright
          )}`
        );
      },
    },
  },
};
addModule(math, "Math");
addModule(date, "Date");
addModule(str, "Str");

export default async function run(
  code: string,
  consoleFunc: (string: string) => void
) {
  await typestack(code, functions, consoleFunc);
}

function addModule(module: StackFunctions, name: string) {
  Object.keys(module).forEach((type) =>
    Object.keys(module[type as keyof StackFunctions]).forEach(
      (func) =>
        (functions[type as keyof StackFunctions][name + "." + func] =
          module[type as keyof StackFunctions][func])
    )
  );
}
