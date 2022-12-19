import { Scanner } from "../src/scan";
import { Parser } from "../src/parse";
import { standardLibraryFunctions } from "../src/functions.js";
import { TSError } from "../src/utils/error";

function parse(input: string) {
    const scanner = new Scanner(input);
    const scanError = scanner.scan();
    expect(scanError).not.toBeInstanceOf(TSError);
    if(scanError instanceof TSError) {
        return;
    }
    const parser = new Parser(scanner.tokens, standardLibraryFunctions);
    return parser.parse();
}

describe("Parser correctly parse functions", () => {
    test("No identifier following fn keyword", () => {
        const input = "fn";
        expect(parse(input)).toBeInstanceOf(TSError);
    });
    test("No parenthesis following identifier", () => {
        const input = "fn identifier";
        expect(parse(input)).toBeInstanceOf(TSError);
    });
    test("No closing bracket following opening bracket", () => {
        const input = "fn identifier(";
        expect(parse(input)).toBeInstanceOf(TSError);
    });
    test("No function type", () => {
        const input = "fn identifier()";
        expect(parse(input)).toBeInstanceOf(TSError);
    });
    test("No bracket following params", () => {
        const input = "fn identifier() @int {";
        expect(parse(input)).toBeInstanceOf(TSError);
    });
    test("No closing bracket", () => {
        const input = "fn identifier() @int {";
        expect(parse(input)).toBeInstanceOf(TSError);
    });
    test("Correctly formatted function", () => {
        const input = `fn negate(t: int) @int {
            0 t -
        }`;
        expect(parse(input)).not.toBeInstanceOf(TSError);
    });

    test("TSError on function within loop statement", () => {
        const input = `
        loop {
            fn negate(t: int) @int {
                0 t -
            }
        }
        `;
        expect(parse(input)).toBeInstanceOf(TSError);
    });
    test("TSError on function within for loop statement", () => {
        const input = `
        for loop {
            fn negate(t: int) @int {
                0 t -
            }
        }
        `;
        expect(parse(input)).toBeInstanceOf(TSError);
    });
    test("TSError on function within while loop statement", () => {
        const input = `
        while loop {
            fn negate(t: int) @int {
                0 t -
            }
        }
        `;
        expect(parse(input)).toBeInstanceOf(TSError);
    });
    test("TSError on function within if statement", () => {
        const input = `
        if {
            fn negate(t: int) @int {
                0 t -
            }
        }
        `;
        expect(parse(input)).toBeInstanceOf(TSError);
    });
    test("TSError on function within else statement", () => {
        const input = `
        if {} else {
            fn negate(t: int) @int {
                0 t -
            }
        }
        `;
        expect(parse(input)).toBeInstanceOf(TSError);
    });
    test("Function with keyword not identifier", () => {
        const input = "fn bool() {}";
        expect(parse(input)).toBeInstanceOf(TSError);
    });
});

describe("Parser correctly parses statements", () => {
    test("Parsing loop without brackets", () => {
        const input = "loop";
        expect(parse(input)).toBeInstanceOf(TSError);
    });
    test("Parsing loop without closing bracket", () => {
        const input = "loop {";
        expect(parse(input)).toBeInstanceOf(TSError);
    });
    test("Parsing correct loop", () => {
        const input = "loop{}";
        expect(parse(input)).not.toBeInstanceOf(TSError);
    });
    test("Parsing while loop without loop keyword", () => {
        const input = "while";
        expect(parse(input)).toBeInstanceOf(TSError);
    });
    test("Parsing while loop without brackets", () => {
        const input = "while loop";
        expect(parse(input)).toBeInstanceOf(TSError);
    });
    test("Parsing loop without closing bracket", () => {
        const input = "while loop {";
        expect(parse(input)).toBeInstanceOf(TSError);
    });
    test("Parsing correct while loop", () => {
        const input = "while loop {}";
        expect(parse(input)).not.toBeInstanceOf(TSError);
    });
    test("Parsing for loop without loop keyword", () => {
        const input = "for";
        expect(parse(input)).toBeInstanceOf(TSError);
    });
    test("Parsing for loop without brackets", () => {
        const input = "for loop";
        expect(parse(input)).toBeInstanceOf(TSError);
    });
    test("Parsing for without closing bracket", () => {
        const input = "for loop {";
        expect(parse(input)).toBeInstanceOf(TSError);
    });
    test("Parsing correct for loop", () => {
        const input = "for loop {}";
        expect(parse(input)).not.toBeInstanceOf(TSError);
    });
    test("Parsing while loop without loop keyword", () => {
        const input = "while";
        expect(parse(input)).toBeInstanceOf(TSError);
    });
    test("Parsing while loop without brackets", () => {
        const input = "while loop";
        expect(parse(input)).toBeInstanceOf(TSError);
    });
    test("Parsing loop without closing bracket", () => {
        const input = "while loop {";
        expect(parse(input)).toBeInstanceOf(TSError);
    });
    test("Parsing if without brackets", () => {
        const input = "if";
        expect(parse(input)).toBeInstanceOf(TSError);
    });
    test("Parsing correct if", () => {
        const input = "if{}";
        expect(parse(input)).not.toBeInstanceOf(TSError);
    });
    test("Parsing if with else without brackets", () => {
        const input = "if{}else";
        expect(parse(input)).toBeInstanceOf(TSError);
    });
    test("Parsing correct if with else", () => {
        const input = "if{}else{}";
        expect(parse(input)).not.toBeInstanceOf(TSError);
    });
    test("Parsing correct nestled statements", () => {
        const input = `if {
            while loop {
                for loop {
                    loop {
                        if {
                            loop {
                    
                            }
                        } else {

                        }
                    }
                }
            }
        }`;
        expect(parse(input)).not.toBeInstanceOf(TSError);
    });
});

describe("Parser should understand when keywords and punctuation are valid", () => {
    test("Parsing invalid closing bracket in root", () => {
        const input = "}";
        expect(parse(input)).toBeInstanceOf(TSError);
    });
    test("Parsing invalid opening bracket in root", () => {
        const input = "{";
        expect(parse(input)).toBeInstanceOf(TSError);
    });
    test("Parsing invalid colon in root", () => {
        const input = ":";
        expect(parse(input)).toBeInstanceOf(TSError);
    });
    test("Parsing invalid opening parenthesis in root", () => {
        const input = "(";
        expect(parse(input)).toBeInstanceOf(TSError);
    });
    test("Parsing invalid closing parenthesis bracket in root", () => {
        const input = ")";
        expect(parse(input)).toBeInstanceOf(TSError);
    });

    test("Parsing invalid break expression", () => {
        const input = "break";
        expect(parse(input)).toBeInstanceOf(TSError);
    });
    test("Parsing invalid continue expression", () => {
        const input = "break";
        expect(parse(input)).toBeInstanceOf(TSError);
    });
    test("Parsing invalid any expression", () => {
        const input = "any";
        expect(parse(input)).toBeInstanceOf(TSError);
    });
    test("Parsing correct continue expression", () => {
        const input = "loop {continue} for loop {continue} while loop {continue}";
        expect(parse(input)).not.toBeInstanceOf(TSError);
    });
    test("Parsing correct break expression", () => {
        const input = "loop {break} for loop {break} while loop {break}";
        expect(parse(input)).not.toBeInstanceOf(TSError);
    });
    test("Parsing correct any expression", () => {
        const input = `
    fn identifier(t: any) @any {
        0 3 any
    }`;
        expect(parse(input)).not.toBeInstanceOf(TSError);
    });
});