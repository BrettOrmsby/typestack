import { Scanner } from "../src/scan";
import { Parser } from "../src/parse";
import { standardLibraryFunctions } from "../src/functions.js";
import { TSError } from "../src/utils/error";

async function parse(input: string) {
    const scanner = new Scanner(input, console.log);
    const scanError = scanner.scan();
    expect(scanError).not.toBeInstanceOf(TSError);
    if (scanError instanceof TSError) {
        return;
    }
    const parser = new Parser(scanner.tokens, standardLibraryFunctions);
    return await parser.parse();
}

describe("Parser correctly parse functions", () => {
    test("No identifier following fn keyword", async () => {
        const input = "fn";
        expect(await parse(input)).toBeInstanceOf(TSError);
    });
    test("No parenthesis following identifier", async () => {
        const input = "fn identifier";
        expect(await parse(input)).toBeInstanceOf(TSError);
    });
    test("No closing bracket following opening bracket", async () => {
        const input = "fn identifier(";
        expect(await parse(input)).toBeInstanceOf(TSError);
    });
    test("No function type", async () => {
        const input = "fn identifier()";
        expect(await parse(input)).toBeInstanceOf(TSError);
    });
    test("No bracket following params", async () => {
        const input = "fn identifier() @int {";
        expect(await parse(input)).toBeInstanceOf(TSError);
    });
    test("No closing bracket", async () => {
        const input = "fn identifier() @int {";
        expect(await parse(input)).toBeInstanceOf(TSError);
    });
    test("Correctly formatted function", async () => {
        const input = `fn negate(t: int) @int {
            0 t -
        }`;
        expect(await parse(input)).not.toBeInstanceOf(TSError);
    });

    test("TSError on function within loop statement", async () => {
        const input = `
        loop {
            fn negate(t: int) @int {
                0 t -
            }
        }
        `;
        expect(await parse(input)).toBeInstanceOf(TSError);
    });
    test("TSError on function within for loop statement", async () => {
        const input = `
        for loop {
            fn negate(t: int) @int {
                0 t -
            }
        }
        `;
        expect(await parse(input)).toBeInstanceOf(TSError);
    });
    test("TSError on function within while loop statement", async () => {
        const input = `
        while loop {
            fn negate(t: int) @int {
                0 t -
            }
        }
        `;
        expect(await parse(input)).toBeInstanceOf(TSError);
    });
    test("TSError on function within if statement", async () => {
        const input = `
        if {
            fn negate(t: int) @int {
                0 t -
            }
        }
        `;
        expect(await parse(input)).toBeInstanceOf(TSError);
    });
    test("TSError on function within else statement", async () => {
        const input = `
        if {} else {
            fn negate(t: int) @int {
                0 t -
            }
        }
        `;
        expect(await parse(input)).toBeInstanceOf(TSError);
    });
    test("Function with keyword not identifier", async () => {
        const input = "fn bool() {}";
        expect(await parse(input)).toBeInstanceOf(TSError);
    });
});

describe("Parser correctly parses statements", () => {
    test("Parsing loop without brackets", async () => {
        const input = "loop";
        expect(await parse(input)).toBeInstanceOf(TSError);
    });
    test("Parsing loop without closing bracket", async () => {
        const input = "loop {";
        expect(await parse(input)).toBeInstanceOf(TSError);
    });
    test("Parsing correct loop", async () => {
        const input = "loop{}";
        expect(await parse(input)).not.toBeInstanceOf(TSError);
    });
    test("Parsing while loop without loop keyword", async () => {
        const input = "while";
        expect(await parse(input)).toBeInstanceOf(TSError);
    });
    test("Parsing while loop without brackets", async () => {
        const input = "while loop";
        expect(await parse(input)).toBeInstanceOf(TSError);
    });
    test("Parsing loop without closing bracket", async () => {
        const input = "while loop {";
        expect(await parse(input)).toBeInstanceOf(TSError);
    });
    test("Parsing correct while loop", async () => {
        const input = "while loop {}";
        expect(await parse(input)).not.toBeInstanceOf(TSError);
    });
    test("Parsing for loop without loop keyword", async () => {
        const input = "for";
        expect(await parse(input)).toBeInstanceOf(TSError);
    });
    test("Parsing for loop without brackets", async () => {
        const input = "for loop";
        expect(await parse(input)).toBeInstanceOf(TSError);
    });
    test("Parsing for without closing bracket", async () => {
        const input = "for loop {";
        expect(await parse(input)).toBeInstanceOf(TSError);
    });
    test("Parsing correct for loop", async () => {
        const input = "for loop {}";
        expect(await parse(input)).not.toBeInstanceOf(TSError);
    });
    test("Parsing while loop without loop keyword", async () => {
        const input = "while";
        expect(await parse(input)).toBeInstanceOf(TSError);
    });
    test("Parsing while loop without brackets", async () => {
        const input = "while loop";
        expect(await parse(input)).toBeInstanceOf(TSError);
    });
    test("Parsing loop without closing bracket", async () => {
        const input = "while loop {";
        expect(await parse(input)).toBeInstanceOf(TSError);
    });
    test("Parsing if without brackets", async () => {
        const input = "if";
        expect(await parse(input)).toBeInstanceOf(TSError);
    });
    test("Parsing correct if", async () => {
        const input = "if{}";
        expect(await parse(input)).not.toBeInstanceOf(TSError);
    });
    test("Parsing if with else without brackets", async () => {
        const input = "if{}else";
        expect(await parse(input)).toBeInstanceOf(TSError);
    });
    test("Parsing correct if with else", async () => {
        const input = "if{}else{}";
        expect(await parse(input)).not.toBeInstanceOf(TSError);
    });
    test("Parsing correct nestled statements", async () => {
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
        expect(await parse(input)).not.toBeInstanceOf(TSError);
    });
});

describe("Parser should understand when keywords and punctuation are valid", () => {
    test("Parsing invalid closing bracket in root", async () => {
        const input = "}";
        expect(await parse(input)).toBeInstanceOf(TSError);
    });
    test("Parsing invalid opening bracket in root", async () => {
        const input = "{";
        expect(await parse(input)).toBeInstanceOf(TSError);
    });
    test("Parsing invalid colon in root", async () => {
        const input = ":";
        expect(await parse(input)).toBeInstanceOf(TSError);
    });
    test("Parsing invalid opening parenthesis in root", async () => {
        const input = "(";
        expect(await parse(input)).toBeInstanceOf(TSError);
    });
    test("Parsing invalid closing parenthesis bracket in root", async () => {
        const input = ")";
        expect(await parse(input)).toBeInstanceOf(TSError);
    });

    test("Parsing invalid break expression", async () => {
        const input = "break";
        expect(await parse(input)).toBeInstanceOf(TSError);
    });
    test("Parsing invalid continue expression", async () => {
        const input = "break";
        expect(await parse(input)).toBeInstanceOf(TSError);
    });
    test("Parsing invalid any expression", async () => {
        const input = "any";
        expect(await parse(input)).toBeInstanceOf(TSError);
    });
    test("Parsing correct continue expression", async () => {
        const input = "loop {continue} for loop {continue} while loop {continue}";
        expect(await parse(input)).not.toBeInstanceOf(TSError);
    });
    test("Parsing correct break expression", async () => {
        const input = "loop {break} for loop {break} while loop {break}";
        expect(await parse(input)).not.toBeInstanceOf(TSError);
    });
    test("Parsing correct any expression", async () => {
        const input = `
    fn identifier(t: any) @any {
        0 3 any
    }`;
        expect(await parse(input)).not.toBeInstanceOf(TSError);
    });
});
