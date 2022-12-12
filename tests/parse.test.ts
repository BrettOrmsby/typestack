import { Scanner } from "../src/scan";
import { Parser } from "../src/parse";
import { standardLibraryFunctions } from "../src/functions.js";
//nestled functions
function parse(input: string) {
    const scanner = new Scanner(input);
    const output = scanner.scan();
    expect(output).not.toBeInstanceOf(Error);
    if(output instanceof Error) {
        return;
    }
    const parser = new Parser(output, standardLibraryFunctions);
    return parser.parse();
}

describe("Parser correctly parse functions", () => {
    test("No identifier following fn keyword", () => {
        const input = "fn";
        expect(parse(input)).toBeInstanceOf(Error);
    });
    test("No parenthesis following identifier", () => {
        const input = "fn identifier";
        expect(parse(input)).toBeInstanceOf(Error);
    });
    test("No closing bracket following opening bracket", () => {
        const input = "fn identifier(";
        expect(parse(input)).toBeInstanceOf(Error);
    });
    test("No function type", () => {
        const input = "fn identifier()";
        expect(parse(input)).toBeInstanceOf(Error);
    });
    test("No bracket following params", () => {
        const input = "fn identifier() @int {";
        expect(parse(input)).toBeInstanceOf(Error);
    });
    test("No closing bracket", () => {
        const input = "fn identifier() @int {";
        expect(parse(input)).toBeInstanceOf(Error);
    });
    test("Correctly formatted function", () => {
        const input = `fn negate(t: int) @int {
            0 t -
        }`;
        expect(parse(input)).not.toBeInstanceOf(Error);
    });

    test("error on function within loop statement", () => {
        const input = `
        loop {
            n negate(t: int) @int {
                0 t -
            }
        }
        `;
        expect(parse(input)).toBeInstanceOf(Error);
    });
    test("error on function within for loop statement", () => {
        const input = `
        for loop {
            n negate(t: int) @int {
                0 t -
            }
        }
        `;
        expect(parse(input)).toBeInstanceOf(Error);
    });
    test("error on function within while loop statement", () => {
        const input = `
        while loop {
            n negate(t: int) @int {
                0 t -
            }
        }
        `;
        expect(parse(input)).toBeInstanceOf(Error);
    });
    test("error on function within if statement", () => {
        const input = `
        if {
            n negate(t: int) @int {
                0 t -
            }
        }
        `;
        expect(parse(input)).toBeInstanceOf(Error);
    });
    test("error on function within else statement", () => {
        const input = `
        if {} else {
            n negate(t: int) @int {
                0 t -
            }
        }
        `;
        expect(parse(input)).toBeInstanceOf(Error);
    });
});

describe("Parser correctly parses statements", () => {
    test("Parsing loop without brackets", () => {
        const input = "loop";
        expect(parse(input)).toBeInstanceOf(Error);
    });
    test("Parsing loop without closing bracket", () => {
        const input = "loop {";
        expect(parse(input)).toBeInstanceOf(Error);
    });
    test("Parsing correct loop", () => {
        const input = "loop{}";
        expect(parse(input)).not.toBeInstanceOf(Error);
    });
    test("Parsing while loop without loop keyword", () => {
        const input = "while";
        expect(parse(input)).toBeInstanceOf(Error);
    });
    test("Parsing while loop without brackets", () => {
        const input = "while loop";
        expect(parse(input)).toBeInstanceOf(Error);
    });
    test("Parsing loop without closing bracket", () => {
        const input = "while loop {";
        expect(parse(input)).toBeInstanceOf(Error);
    });
    test("Parsing correct while loop", () => {
        const input = "while loop {}";
        expect(parse(input)).not.toBeInstanceOf(Error);
    });
    test("Parsing for loop without loop keyword", () => {
        const input = "for";
        expect(parse(input)).toBeInstanceOf(Error);
    });
    test("Parsing for loop without brackets", () => {
        const input = "for loop";
        expect(parse(input)).toBeInstanceOf(Error);
    });
    test("Parsing for without closing bracket", () => {
        const input = "for loop {";
        expect(parse(input)).toBeInstanceOf(Error);
    });
    test("Parsing correct for loop", () => {
        const input = "for loop {}";
        expect(parse(input)).not.toBeInstanceOf(Error);
    });
    test("Parsing while loop without loop keyword", () => {
        const input = "while";
        expect(parse(input)).toBeInstanceOf(Error);
    });
    test("Parsing while loop without brackets", () => {
        const input = "while loop";
        expect(parse(input)).toBeInstanceOf(Error);
    });
    test("Parsing loop without closing bracket", () => {
        const input = "while loop {";
        expect(parse(input)).toBeInstanceOf(Error);
    });
    test("Parsing if without brackets", () => {
        const input = "if";
        expect(parse(input)).toBeInstanceOf(Error);
    });
    test("Parsing correct if", () => {
        const input = "if{}";
        expect(parse(input)).not.toBeInstanceOf(Error);
    });
    test("Parsing if with else without brackets", () => {
        const input = "if{}else";
        expect(parse(input)).toBeInstanceOf(Error);
    });
    test("Parsing correct if with else", () => {
        const input = "if{}else{}";
        expect(parse(input)).not.toBeInstanceOf(Error);
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
        expect(parse(input)).not.toBeInstanceOf(Error);
    });
});