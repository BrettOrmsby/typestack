import { Scanner } from "./scan.js";
import { Parser, Program } from "./parse.js";
import { standardLibraryFunctions } from "./functions.js";

export default function interpret(input: string): Program {
    const scanner = new Scanner(input);
    const tokens = scanner.scan();
    if(tokens instanceof Error) {
        throw tokens;
    }
   
    const parser = new Parser(tokens, standardLibraryFunctions);
    const error = parser.parse();
    if(error) {
        throw error;
    }
    return parser.program;
}