import { Scanner } from "../src/scan";
import { TSError } from "../src/utils/error.js";
describe("Scanner should error on invalid input", () => {
    test("Invalid string input", () => {
        const input = `44 identifier "string
      cont.
      `;
        const scanner = new Scanner(input, console.log);
        expect(scanner.scan()[0]).toBeInstanceOf(TSError);
    });

    test("Invalid string escape", () => {
        const input = `44 identifier "string \\g"
      `;
        const scanner = new Scanner(input, console.log);
        expect(scanner.scan()[0]).toBeInstanceOf(TSError);
    });

    test("Invalid number without separator", () => {
        const input = "44word";
        const scanner = new Scanner(input, console.log);
        expect(scanner.scan()[0]).toBeInstanceOf(TSError);
    });

    test("Invalid str without separator", () => {
        const input = "\"string\"444";
        const scanner = new Scanner(input, console.log);
        expect(scanner.scan()[0]).toBeInstanceOf(TSError);
    });
});

describe("Scanner should parse a program", () => {
    test("Literal parsing", () => {
        const input = "\"string\" 7 9.3 false true drop";
        const scanner = new Scanner(input, console.log);
        expect(scanner.scan()[0]).not.toBeInstanceOf(TSError);
    });

    test("Punctuation parsing", () => {
        const input = "():{} ( ) : { }";
        const scanner = new Scanner(input, console.log);
        expect(scanner.scan()[0]).not.toBeInstanceOf(TSError);
    });

    test("Keyword parsing", () => {
        const input = "fn loop while true";
        const scanner = new Scanner(input, console.log);
        expect(scanner.scan()[0]).not.toBeInstanceOf(TSError);
    });

    test("Mixed parsing", () => {
        const input = "fn( loop{ while::: \"str\") 44.44:break true";
        const scanner = new Scanner(input, console.log);
        expect(scanner.scan()[0]).not.toBeInstanceOf(TSError);
    });

    test("String escape code parsing", () => {
        const input = " \"\\\\ \\n \\t \\r \\\" \\\\\\n \"";
        const scanner = new Scanner(input, console.log);
        expect(scanner.scan()[0]).not.toBeInstanceOf(TSError);
    });
});
