// TODO: error function, comments
// TODO: statments should also have positions so the interpret errors can be better
// TODO: fix a bug in type checking where a function called on an `any` stack is invalid even if there
//       is an individual function in each stack type instead of one function in the any type
// TODO: instead of keep pasing up the errors in a new json each time, just pass it
import { Scanner } from "./scan.js";
import { Parser } from "./parse.js";
import typeCheck from "./typeCheck.js";
import { standardLibraryFunctions } from "./functions.js";
import interpret from "./interpret.js";

export default function typeStack(input: string) {
    const scanner = new Scanner(input);
    const tokens = scanner.scan();
    if(tokens instanceof Error) {
        throw tokens;
    }
   
    const parser = new Parser(tokens, standardLibraryFunctions);
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

const input = `
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