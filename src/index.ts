import { Scanner } from "./scan.js";
import { Parser } from "./parse.js";
import typeCheck from "./typeCheck.js";
import { StackFunctions, standardLibraryFunctions } from "./functions.js";
import Interpreter from "./interpret.js";
import { isTSError } from "./utils/error.js";

export default async function typeStack(
  input: string,
  functions?: StackFunctions,
  consoleFunc: (string: string) => void = console.log
) {
  let importedFunctions = standardLibraryFunctions;
  if (functions) {
    importedFunctions = combineStackFunctions(importedFunctions, functions);
  }

  const scanner = new Scanner(input, consoleFunc);
  const scanError = scanner.scan();
  if (isTSError(scanError)) {
    scanError.fire();
    return;
  }

  const parser = new Parser(scanner.tokens, importedFunctions);
  const parseError = await parser.parse();
  if (parseError) {
    parseError.fire();
  }

  const typeErrors = typeCheck(
    parser.program,
    importedFunctions,
    parser.newFunctions
  );
  if (typeErrors.length > 0) {
    typeErrors.forEach((e) => e.fire());
    return;
  }

  const interpreter = new Interpreter(
    parser.program,
    parser.functions,
    consoleFunc
  );
  const runError = await interpreter.run();
  if (isTSError(runError)) {
    runError.fire();
  }
}

function combineStackFunctions(
  main: StackFunctions,
  overload: StackFunctions
): StackFunctions {
  for (const stack of Object.keys(overload)) {
    for (const key in overload[stack]) {
      main[stack][key] = overload[stack][key];
    }
  }
  return main;
}
