import { Scanner } from "./scan.js";
import { Parser, Program } from "./parse.js";
import typeCheck from "./typeCheck.js";
import { standardLibraryFunctions } from "./functions.js";

export default function interpret(input: string): Program {
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

    return parser.program;
}