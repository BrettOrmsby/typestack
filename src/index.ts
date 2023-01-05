import { Scanner } from "./scan.js";
import { Parser } from "./parse.js";
import typeCheck from "./typeCheck.js";
import { standardLibraryFunctions } from "./functions.js";
import interpret from "./interpret.js";
import { isTSError } from "./utils/error.js";

export default async function typeStack(input: string) {
  const scanner = new Scanner(input);
  const scanError = scanner.scan();
  if (isTSError(scanError)) {
    scanError.fire();
    return;
  }

  const parser = new Parser(scanner.tokens, standardLibraryFunctions);
  const parseError = await parser.parse();
  if (parseError) {
    parseError.fire();
  }

  const typeErrors = typeCheck(
    parser.program,
    standardLibraryFunctions,
    parser.newFunctions
  );
  if (typeErrors.length > 0) {
    typeErrors.forEach((e) => e.fire());
    return;
  }

  const runError = await interpret(parser.program, parser.functions);
  if (isTSError(runError)) {
    runError.fire();
  }
}
