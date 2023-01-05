import { TSError, ErrorInputConfig } from "./utils/error.js";
export enum TokenType {
  Int,
  Float,
  Str,
  Bool,
  Keyword,
  Identifier,
  Colon,
  OpenParen,
  CloseParen,
  OpenBracket,
  CloseBracket,
  EOF,
}

export type Pos = {
  line: number;
  char: number;
};

export type Token = {
  type: TokenType;
  startPos: Pos;
  endPos: Pos;
  value: string | number | boolean;
};

export class Scanner {
  input: string;
  tokens: Token[];
  pointer: number;
  char: number;
  line: number;

  constructor(input: string) {
    input = input.trimEnd();
    ErrorInputConfig.input = input;
    this.input = input;
    this.tokens = [];
    this.pointer = 0;
    this.char = 1;
    this.line = 1;
  }

  scan(): TSError | void {
    while (!this.#isAtEnd()) {
      const current = this.#peek();

      if (["(", ")", "{", "}", ":"].includes(current)) {
        switch (current) {
          case "(":
            this.#addToken(TokenType.OpenParen, "(");
            break;
          case ")":
            this.#addToken(TokenType.CloseParen, ")");
            break;
          case "{":
            this.#addToken(TokenType.OpenBracket, "{");
            break;
          case "}":
            this.#addToken(TokenType.CloseBracket, "}");
            break;
          case ":":
            this.#addToken(TokenType.Colon, ":");
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
              return new TSError(
                {
                  startPos: { line: this.line, char: this.char - 1 },
                  endPos: { line: this.line, char: this.char + 1 },
                },
                "unknown escape code"
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
          return new TSError(
            {
              startPos: startPos,
              endPos: { line: this.line, char: this.char },
            },
            'expected an ending string literal `"`'
          );
        }

        this.#increment();

        this.#addToken(TokenType.Str, str, startPos);

        const posError = this.#expectSeparator();
        if (posError) {
          return posError;
        }
        continue;
      }

      if (current >= "0" && current <= "9") {
        const posError = this.#number();
        if (posError) {
          return posError;
        }
      } else {
        this.#identifier();
      }
    }
    this.#increment();
    this.#addToken(TokenType.EOF, false);
  }

  #addToken(
    type: TokenType,
    value: string | number | boolean,
    startPos?: Pos,
    endPos?: Pos
  ) {
    startPos = startPos ? startPos : { line: this.line, char: this.char };
    this.tokens.push({
      type,
      value,
      startPos,
      endPos: endPos ? endPos : { line: this.line, char: this.char },
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
  #expectSeparator(): TSError | void {
    if (
      !this.#isAtEnd() &&
      !["\n", "\r", "\t", " ", "{", "}", "(", ")", ":", "#"].includes(
        this.#peek()
      )
    ) {
      return new TSError(
        {
          startPos: { line: this.line, char: this.char },
          endPos: { line: this.line, char: this.char },
        },
        "Expected separator (`\\n`, `\\r`, `\\t`, ` `, `{`, `}`, `(`, `)`, `:`)`"
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
        return new TSError(
          {
            startPos: { line: startPos.line, char: startPos.char },
            endPos: { line: this.line, char: this.char },
          },
          "Unable to parse float"
        );
      }

      this.#addToken(TokenType.Float, float, startPos);
    } else {
      const int = parseInt(strOfNumber);
      if (Number.isNaN(int)) {
        return new TSError(
          {
            startPos: { line: startPos.line, char: startPos.char },
            endPos: { line: this.line, char: this.char },
          },
          "Unable to parse int"
        );
      }

      this.#addToken(TokenType.Int, int, startPos);
    }

    return this.#expectSeparator();
  }

  #identifier() {
    const startPos = {
      line: this.line,
      char: this.char,
    };
    let str = "";

    while (
      !this.#isAtEnd() &&
      ![" ", "\n", "\t", "\r", ":", "{", "}", "(", ")"].includes(this.#peek())
    ) {
      str += this.#peek();
      this.#increment();
    }

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
    ];

    if (str === "false") {
      this.#addToken(TokenType.Bool, false, startPos);
    } else if (str === "true") {
      this.#addToken(TokenType.Bool, true, startPos);
    } else if (keywords.includes(str)) {
      this.#addToken(TokenType.Keyword, str, startPos);
    } else {
      this.#addToken(TokenType.Identifier, str, startPos);
    }
  }
}
