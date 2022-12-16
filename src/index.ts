// TODO: features to add: escape characters in string, module loading
import { Scanner } from "./scan.js";
import { Parser } from "./parse.js";
import typeCheck from "./typeCheck.js";
import { standardLibraryFunctions } from "./functions.js";
import interpret from "./interpret.js";
import { isTSError } from "./utils/error.js";

export default function typeStack(input: string) {
    const scanner = new Scanner(input);
    const scanError = scanner.scan();
    if(isTSError(scanError)) {
        scanError.fire();
        return;
    }
   
    const parser = new Parser(scanner.tokens, standardLibraryFunctions);
    const parseError = parser.parse();
    if(parseError) {
        throw parseError;
    }

    const typeError = typeCheck(parser.program, standardLibraryFunctions, parser.newFunctions);
    if(typeError) {
        throw typeError;
    }
    
    const runError = interpret(parser.program, parser.functions);
    if(runError instanceof Error) {
        throw runError;
    }
}

let input = `
100 for loop {
    dup 15 % 0 ==
    if {
      "FizzBuzz" print drop
    } else {
      int dup 5 % 0 ==
      if {
        "Buzz" print drop
      } else {
        int dup 3 % 0 ==
        if {
          "Fizz" print drop
        } else {
          int print
        }
      }
    }
  }
`;

typeStack(input);