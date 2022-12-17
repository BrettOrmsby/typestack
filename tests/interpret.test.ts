import { Scanner } from "../src/scan";
import { Parser } from "../src/parse";
import typeCheck from "../src/typeCheck";
import interpret from "../src/interpret";
import { standardLibraryFunctions } from "../src/functions";
import { TSError } from "../src/utils/error";

function run(input: string) {
    const scanner = new Scanner(input);
    const scanError = scanner.scan();
    expect(scanError).not.toBeInstanceOf(TSError);
    if(scanError instanceof TSError) {
        return;
    }

    const parser = new Parser(scanner.tokens, standardLibraryFunctions);
    const parseError = parser.parse();
    expect(parseError).not.toBeInstanceOf(Error);
    if(parseError instanceof Error) {
        return;
    }

    const typeErrors = typeCheck(parser.program, standardLibraryFunctions, parser.newFunctions);
    expect(typeErrors.length).toBe(0);
    if(typeErrors.length > 0) {
        return;
    }

    return interpret(parser.program, parser.functions);
}

describe("Interpreter runs basic programs", () => {
    test("It runs math functions on ints",() => {
        const input = "1 2 + 5 - 4 * 2 % print";
        const consoleSpy = jest.spyOn(console, "log");
        run(input);
        expect(consoleSpy).toHaveBeenCalledWith(-0);
    });
    test("It can print strings",() => {
        const input = "\"Hello, World!\" print";
        const consoleSpy = jest.spyOn(console, "log");
        run(input);
        expect(consoleSpy).toHaveBeenCalledWith("Hello, World!");
    });
    test("It can evaluate if conditions",() => {
        const input = `
        9 3 % 0 ==
        if {
            "9 is divisible by 3" print drop
        } else {
            "9 is not divisible by 3" print drop
        }
        9 2 % 0 == 
        if {
            "9 is divisible by 2" print drop
        } else {
            "9 is not divisible by 2" print drop
        }
        `;
        const consoleSpy = jest.spyOn(console, "log");
        run(input);
        expect(consoleSpy).toHaveBeenCalledWith("9 is divisible by 3");
        expect(consoleSpy).toHaveBeenCalledWith("9 is not divisible by 2");
    });
    test("It can run loops",() => {
        const input = `
        100
        loop {
            1 +
            dup 200 >
            if {
                break
            }
        }
        print
        `;
        const consoleSpy = jest.spyOn(console, "log");
        run(input);
        expect(consoleSpy).toHaveBeenCalledWith(201);
    });
    test("It can run while loops",() => {
        const input = `
        100 dup 200 >
        while loop {
            1 +
            dup 200 >
        }
        print
        `;
        const consoleSpy = jest.spyOn(console, "log");
        run(input);
        expect(consoleSpy).toHaveBeenCalledWith(201);
    });
    test("It can run for loops",() => {
        const input = `
        100 dup
        for loop {
            swap 1 + swap
        }
        drop print
        `;
        const consoleSpy = jest.spyOn(console, "log");
        run(input);
        expect(consoleSpy).toHaveBeenCalledWith(201);
    });
    test("It can run functions",() => {
        const input = `
        fn negate(num: int) @int {
            0 num -
        }
        99 negate print
        `;
        const consoleSpy = jest.spyOn(console, "log");
        run(input);
        expect(consoleSpy).toHaveBeenCalledWith(-99);
    });
}); 