import { TSError, ErrorInputConfig } from "./utils/error.js";

export type TokenType =
  | "int"
  | "float"
  | "str"
  | "bool"
  | "keyword"
  | "identifier"
  | "colon"
  | "openParen"
  | "closeParen"
  | "openBracket"
  | "closeBracket"
  | "EOF";

const keywords = [
  "import",
  "fn",
  "loop",
  "for",
  "while",
  "if",
  "else",
  "break",
  "continue",
  "int",
  "bool",
  "str",
  "float",
  "any",
  "@int",
  "@float",
  "@str",
  "@bool",
  "@any",
] as const;

export type Keyword = typeof keywords[number];

export type Pos = {
  line: number;
  char: number;
};

export type Token<T extends TokenType> = {
  type: TokenType;
  startPos: Pos;
  endPos: Pos;
  value: T extends "int"
    ? number
    : T extends "float"
    ? number
    : T extends "bool"
    ? boolean
    : T extends "keyword"
    ? Keyword
    : string;
};

export class Scanner {
  input: string;
  tokens: Token<TokenType>[];
  pointer: number;
  char: number;
  line: number;
  errors: TSError[];

  constructor(input: string, consoleFunc: (string: string) => void) {
    input = input.trimEnd();
    ErrorInputConfig.input = input;
    ErrorInputConfig.consoleFunc = consoleFunc;

    this.input = input;
    this.tokens = [];
    this.pointer = 0;
    this.char = 1;
    this.line = 1;
    this.errors = [];
  }

  scan(): TSError[] {
    while (!this.#isAtEnd()) {
      const current = this.#peek();

      if (["(", ")", "{", "}", ":"].includes(current)) {
        switch (current) {
          case "(":
            this.#addToken("openParen", "(");
            break;
          case ")":
            this.#addToken("closeParen", ")");
            break;
          case "{":
            this.#addToken("openBracket", "{");
            break;
          case "}":
            this.#addToken("closeBracket", "}");
            break;
          case ":":
            this.#addToken("colon", ":");
        }
        this.#increment();
        continue;
      }

      if ("#" === current) {
        while (!this.#isAtEnd() && this.#peek() !== "\n") {
          this.#increment();
        }
        continue;
      }

      if ([" ", "\t", "\r"].includes(current)) {
        this.#increment();
        continue;
      }

      if ("\n" === current) {
        this.#newline();
        continue;
      }

      if ('"' === current) {
        const startPos = {
          line: this.line,
          char: this.char,
        };

        this.#increment();
        let str = "";

        while (!this.#isAtEnd() && this.#peek() !== '"') {
          if (this.#peek() === "\\") {
            this.#increment();
            if (this.#peek() === "\\") {
              str += "\\";
            } else if (this.#peek() === "n") {
              str += "\n";
            } else if (this.#peek() === "r") {
              str += "\r";
            } else if (this.#peek() === "t") {
              str += "\t";
            } else if (this.#peek() === '"') {
              str += '"';
            } else {
              this.errors.push(
                new TSError(
                  {
                    startPos: { line: this.line, char: this.char - 1 },
                    endPos: { line: this.line, char: this.char + 1 },
                  },
                  "unknown escape code"
                )
              );
            }
            this.#increment();
          } else {
            str += this.#peek();

            if (this.#peek() === "\n") {
              this.#newline();
            } else {
              this.#increment();
            }
          }
        }

        if (this.#isAtEnd()) {
          this.errors.push(
            new TSError(
              {
                startPos: startPos,
                endPos: { line: this.line, char: this.char },
              },
              'expected an ending string literal `"`'
            )
          );
        }

        this.#increment();

        this.#addToken("str", str, startPos);

        this.#expectSeparator();
        continue;
      }

      if (current >= "0" && current <= "9") {
        this.#number();
      } else {
        this.#identifier();
      }
    }
    this.#increment();
    this.#addToken("EOF", "");
    return this.errors;
  }

  #addToken<T extends TokenType>(
    type: T,
    value: Token<T>["value"],
    startPos: Pos = { line: this.line, char: this.char },
    endPos: Pos = { line: this.line, char: this.char }
  ) {
    this.tokens.push({
      type,
      value,
      startPos,
      endPos,
    });
  }

  #isAtEnd(): boolean {
    return this.pointer >= this.input.length;
  }
  #peek(): string {
    return this.input[this.pointer];
  }
  #increment() {
    this.pointer += 1;
    this.char += 1;
  }
  #newline() {
    this.pointer += 1;
    this.line += 1;
    this.char = 1;
  }
  #expectSeparator() {
    if (
      !this.#isAtEnd() &&
      !["\n", "\r", "\t", " ", "{", "}", "(", ")", ":", "#"].includes(
        this.#peek()
      )
    ) {
      this.errors.push(
        new TSError(
          {
            startPos: { line: this.line, char: this.char },
            endPos: { line: this.line, char: this.char + 1 },
          },
          "Expected separator (`\\n`, `\\r`, `\\t`, ` `, `{`, `}`, `(`, `)`, `:`)"
        )
      );
    }
  }

  #number(): TSError | void {
    const startPos = {
      line: this.line,
      char: this.char,
    };
    let strOfNumber = "";

    while (!this.#isAtEnd() && this.#peek() >= "0" && this.#peek() <= "9") {
      strOfNumber += this.#peek();
      this.#increment();
    }

    if (!this.#isAtEnd() && this.#peek() === ".") {
      strOfNumber += ".";
      this.#increment();

      while (!this.#isAtEnd() && this.#peek() >= "0" && this.#peek() <= "9") {
        strOfNumber += this.#peek();
        this.#increment();
      }

      const float = parseFloat(strOfNumber);
      if (Number.isNaN(float)) {
        this.errors.push(
          new TSError(
            {
              startPos: { line: startPos.line, char: startPos.char },
              endPos: { line: this.line, char: this.char },
            },
            "Unable to parse float"
          )
        );
      }

      this.#addToken("float", float, startPos);
    } else {
      const int = parseInt(strOfNumber);
      if (Number.isNaN(int)) {
        this.errors.push(
          new TSError(
            {
              startPos: { line: startPos.line, char: startPos.char },
              endPos: { line: this.line, char: this.char },
            },
            "Unable to parse int"
          )
        );
      }

      this.#addToken("int", int, startPos);
    }
    this.#expectSeparator();
  }

  #identifier() {
    const startPos = {
      line: this.line,
      char: this.char,
    };
    let str = "";

    while (
      !this.#isAtEnd() &&
      ![" ", "\n", "\t", "\r", ":", "{", "}", "(", ")", "#"].includes(
        this.#peek()
      )
    ) {
      str += this.#peek();
      this.#increment();
    }

    if (str === "false") {
      this.#addToken("bool", false, startPos);
    } else if (str === "true") {
      this.#addToken("bool", true, startPos);
    } else if (keywords.some((e) => e === str)) {
      this.#addToken("keyword", str as Keyword, startPos);
    } else {
      this.#addToken("identifier", str, startPos);
    }
  }
}
