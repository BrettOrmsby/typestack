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
  const scanErrors = scanner.scan();
  scanErrors.forEach((e) => e.fire());

  const parser = new Parser(scanner.tokens, importedFunctions);
  const parseErrors = await parser.parse();
  parseErrors.forEach((e) => e.fire());

  const typeErrors = typeCheck(
    parser.program,
    importedFunctions,
    parser.newFunctions
  );
  typeErrors.forEach((e) => e.fire());

  if (
    scanErrors.length > 0 ||
    parseErrors.length > 0 ||
    typeErrors.length > 0
  ) {
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
