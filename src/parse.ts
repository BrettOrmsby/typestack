import { TokenType, Token, Pos } from "./scan.js";
import { type StackFunctions } from "./functions.js";
import { StackType } from "./stack.js";
import { TSError, isTSError } from "./utils/error.js";

type ExpressionType =
  | TokenType.Int
  | TokenType.Float
  | TokenType.Str
  | TokenType.Bool
  | TokenType.Identifier
  | TokenType.Keyword;
export type Expression = {
  type: ExpressionType;
  startPos: Pos;
  endPos: Pos;
  value: string | number | boolean;
};

export enum StatementType {
  ForLoop,
  WhileLoop,
  Loop,
  If,
}

export type Statement = {
  type: StatementType;
  startPos: Pos;
  endPos: Pos;
  block: Program;
  else?: Program;
};

export type Program = Array<Expression | Statement>;

export class Parser {
  tokens: Token[];
  pointer: number;
  functions: StackFunctions;
  newFunctions: { name: string; type: StackType }[];
  program: Program;

  constructor(tokens: Token[], functions: StackFunctions) {
    this.tokens = tokens;
    this.functions = functions;
    this.newFunctions = [];
    this.pointer = 0;
    this.program = [];
  }
  async parse(): Promise<TSError | void> {
    const importError = await this.#parseImports();
    if (isTSError(importError)) {
      return importError;
    }
    const block = this.#parseStatement(true);
    if (isTSError(block)) {
      return block;
    }
    this.program = block;
  }
  async #parseImports() {
    this.pointer -= 1;
    while (this.pointer < 0 || !this.#isAtEnd()) {
      if (this.#expect(TokenType.Keyword, "import")) {
        if (this.#expect(TokenType.Identifier)) {
          // dynamically import the file and add the module functions to the functions
          try {
            const module = (await import(`./modules/${this.#peek().value}.js`))
              .default as unknown as StackFunctions;

            for (const stack of Object.values(StackType)) {
              for (const key in module[stack]) {
                this.functions[stack][this.#peek().value + "." + key] =
                  module[stack][key];
              }
            }
          } catch (_) {
            return new TSError(
              {
                startPos: this.#peek().startPos,
                endPos: this.#peek().endPos,
              },
              "unable to import module"
            );
          }
        } else {
          return new TSError(
            {
              startPos: this.#peek().startPos,
              endPos: this.#peek().endPos,
            },
            "expected an identifier after an `import` keyword"
          );
        }
      } else {
        return;
      }
    }
  }
  #parseStatement(
    isInRoot: boolean,
    isInLoop = false,
    isInIf = false,
    isInFunction = false
  ): TSError | Program {
    // increment past the `{` character
    if (!isInRoot) {
      this.#increment();
    }

    const block: Program = [];

    while (!this.#isAtEnd()) {
      const current = this.#peek();

      // Punctuation should not be in the middle of nowhere
      if (
        [
          TokenType.OpenBracket,
          TokenType.CloseParen,
          TokenType.OpenParen,
          TokenType.Colon,
        ].includes(current.type)
      ) {
        return new TSError(
          {
            startPos: current.startPos,
            endPos: current.endPos,
          },
          "unexpected character"
        );
      }

      // literals become expressions
      if (
        [
          TokenType.Int,
          TokenType.Float,
          TokenType.Str,
          TokenType.Bool,
          TokenType.Identifier,
        ].includes(current.type)
      ) {
        block.push(current as Expression);
        this.#increment();
        continue;
      }

      // return the block when hitting a `}` unless in the root witch would be an error
      if (TokenType.CloseBracket === current.type) {
        if (isInRoot) {
          return new TSError(
            {
              startPos: current.startPos,
              endPos: current.endPos,
            },
            "unexpected character"
          );
        }
        this.#increment();
        return block;
      }

      if (TokenType.Keyword === current.type) {
        // stack types become expressions
        if (["int", "bool", "str", "float"].includes(current.value as string)) {
          block.push(current as Expression);
          this.#increment();
          continue;
        }

        // At keyword are invalid
        if (
          ["@int", "@bool", "@str", "@float", "@any"].includes(
            current.value as string
          )
        ) {
          return new TSError(
            {
              startPos: current.startPos,
              endPos: current.endPos,
            },
            "unexpected keyword `{}`. Keyword `{}` must only be found after parameters in a function declaration",
            current.value,
            current.value
          );
        }

        // else is invalid
        if ("else" === current.value) {
          return new TSError(
            {
              startPos: current.startPos,
              endPos: current.endPos,
            },
            "unexpected keyword `else`. Keyword `else` must only be found after if statements"
          );
        }

        // any can only be found in functions
        if ("any" === current.value) {
          if (isInFunction) {
            block.push(current as Expression);
            this.#increment();
            continue;
          } else {
            return new TSError(
              {
                startPos: current.startPos,
                endPos: current.endPos,
              },
              "unexpected keyword `any`. Keyword `any` must only be found in `@any` functions"
            );
          }
        }

        // break can only be found in loops
        if ("break" === current.value) {
          if (isInLoop) {
            block.push(current as Expression);
            this.#increment();
            continue;
          } else {
            return new TSError(
              {
                startPos: current.startPos,
                endPos: current.endPos,
              },
              "unexpected keyword `break`. Keyword `break` must only be found in loops"
            );
          }
        }

        // continue can only be found in loops
        if ("continue" === current.value) {
          if (isInLoop) {
            block.push(current as Expression);
            this.#increment();
            continue;
          } else {
            return new TSError(
              {
                startPos: current.startPos,
                endPos: current.endPos,
              },
              "unexpected keyword `continue`. Keyword `continue` must only be found in loops"
            );
          }
        }

        // import is invalid unless at th top of the program
        if ("import" === current.value) {
          return new TSError(
            {
              startPos: current.startPos,
              endPos: current.endPos,
            },
            "unexpected keyword `import`. Keyword `import` must only be found at the top of programs"
          );
        }

        // parsing statements

        if ("loop" === current.value) {
          const startPos = current.startPos;
          const endPos = current.endPos;

          // opening bracket should follow a loop keyword
          if (!this.#expect(TokenType.OpenBracket)) {
            return new TSError(
              {
                startPos: this.#peek().startPos,
                endPos: this.#peek().endPos,
              },
              "expected an opening bracket `{` after a `loop` keyword"
            );
          }

          const innerBlock = this.#parseStatement(
            false,
            true,
            isInIf,
            isInFunction
          );

          if (isTSError(innerBlock)) {
            return innerBlock;
          }

          block.push({
            startPos,
            endPos,
            type: StatementType.Loop,
            block: innerBlock,
          });
          continue;
        }

        if ("for" === current.value) {
          const startPos = current.startPos;

          // loop and an opening bracket should follow a for keyword
          if (!this.#expect(TokenType.Keyword, "loop")) {
            return new TSError(
              {
                startPos: this.#peek().startPos,
                endPos: this.#peek().endPos,
              },
              "expected a `loop` keyword after a `for` keyword"
            );
          }

          const endPos = this.#peek().endPos;

          if (!this.#expect(TokenType.OpenBracket)) {
            return new TSError(
              {
                startPos: this.#peek().startPos,
                endPos: this.#peek().endPos,
              },
              "expected an opening bracket `{` after a `loop` keyword"
            );
          }

          const innerBlock = this.#parseStatement(
            false,
            true,
            isInIf,
            isInFunction
          );

          if (isTSError(innerBlock)) {
            return innerBlock;
          }

          block.push({
            startPos,
            endPos,
            type: StatementType.ForLoop,
            block: innerBlock,
          });
          continue;
        }

        if ("while" === current.value) {
          const startPos = current.startPos;

          // loop and an opening bracket should follow a while keyword
          if (!this.#expect(TokenType.Keyword, "loop")) {
            return new TSError(
              {
                startPos: this.#peek().startPos,
                endPos: this.#peek().endPos,
              },
              "expected a `loop` keyword after a `while` keyword"
            );
          }

          const endPos = this.#peek().endPos;

          if (!this.#expect(TokenType.OpenBracket)) {
            return new TSError(
              {
                startPos: this.#peek().startPos,
                endPos: this.#peek().endPos,
              },
              "expected an opening bracket `{` after a `loop` keyword"
            );
          }

          const innerBlock = this.#parseStatement(
            false,
            true,
            isInIf,
            isInFunction
          );

          if (isTSError(innerBlock)) {
            return innerBlock;
          }

          block.push({
            startPos,
            endPos,
            type: StatementType.WhileLoop,
            block: innerBlock,
          });
          continue;
        }

        if ("if" === current.value) {
          const startPos = current.startPos;
          const endPos = current.endPos;

          // an opening bracket should follow an if
          if (!this.#expect(TokenType.OpenBracket)) {
            return new TSError(
              {
                startPos: this.#peek().startPos,
                endPos: this.#peek().endPos,
              },
              "expected an opening bracket `{` after an `if` keyword"
            );
          }

          const innerBlock = this.#parseStatement(
            false,
            isInLoop,
            true,
            isInFunction
          );

          if (isTSError(innerBlock)) {
            return innerBlock;
          }

          // an optional else keyword can follow with an opening bracket
          this.pointer -= 1;
          if (this.#expect(TokenType.Keyword, "else")) {
            if (!this.#expect(TokenType.OpenBracket)) {
              return new TSError(
                {
                  startPos: this.#peek().startPos,
                  endPos: this.#peek().endPos,
                },
                "expected an opening bracket `{` after an `else` keyword"
              );
            }

            const elseBlock = this.#parseStatement(
              false,
              isInLoop,
              true,
              isInFunction
            );

            if (isTSError(elseBlock)) {
              return elseBlock;
            }

            block.push({
              startPos,
              endPos,
              type: StatementType.If,
              block: innerBlock,
              else: elseBlock,
            });
            continue;
          }
          block.push({
            startPos,
            endPos,
            type: StatementType.If,
            block: innerBlock,
          });
          continue;
        }

        if ("fn" === current.value) {
          // functions must not be nestled
          if (!isInRoot) {
            return new TSError(
              {
                startPos: current.startPos,
                endPos: current.endPos,
              },
              "unexpected `fn` keyword. Function declarations must not be nestled in other statements"
            );
          }

          // the name of the function (identifier) should follow
          if (!this.#expect(TokenType.Identifier)) {
            return new TSError(
              {
                startPos: this.#peek().startPos,
                endPos: this.#peek().endPos,
              },
              "expected an identifier after a `fn` keyword"
            );
          }
          const name = this.#peek().value as string;

          // an opening parenthesis should follow
          if (!this.#expect(TokenType.OpenParen)) {
            return new TSError(
              {
                startPos: this.#peek().startPos,
                endPos: this.#peek().endPos,
              },
              "expected an opening parenthesis `(` after a function identifier"
            );
          }

          const params: Record<string, StackType> = {};

          // get all the parameters from the function
          while (!this.#isAtEnd() && !this.#expect(TokenType.CloseParen)) {
            this.pointer -= 1;
            if (!this.#expect(TokenType.Identifier)) {
              return new TSError(
                {
                  startPos: this.#peek().startPos,
                  endPos: this.#peek().endPos,
                },
                "expected an identifier or closing bracket `)` after a function's opening bracket `(`"
              );
            }
            const name = this.#peek().value as string;

            // parameters can have a type associated with them separated by a colon
            if (this.#expect(TokenType.Colon)) {
              this.#increment();
              if (
                this.#peek().type === TokenType.Keyword &&
                ["int", "str", "float", "bool", "any"].includes(
                  this.#peek().value as string
                )
              ) {
                params[name] = {
                  int: StackType.Int,
                  float: StackType.Float,
                  str: StackType.Str,
                  bool: StackType.Bool,
                  any: StackType.Any,
                }[this.#peek().value as string];
              } else {
                return new TSError(
                  {
                    startPos: this.#peek().startPos,
                    endPos: this.#peek().endPos,
                  },
                  "expected a type `int`, `float`, `str`, `bool` or `any` after a colon for a function parameter"
                );
              }
            } else {
              this.pointer -= 1;
              params[name] = StackType.Any;
            }
          }

          if (this.#isAtEnd()) {
            return new TSError(
              {
                startPos: this.#peek().startPos,
                endPos: this.#peek().endPos,
              },
              "expected a closing parenthesis `)`"
            );
          }

          let functionType: StackType;

          this.#increment();

          // a function type should follow
          if (
            !this.#isAtEnd() &&
            this.#peek().type === TokenType.Keyword &&
            ["@int", "@str", "@float", "@bool", "@any"].includes(
              this.#peek().value as string
            )
          ) {
            functionType = {
              "@int": StackType.Int,
              "@float": StackType.Float,
              "@str": StackType.Str,
              "@bool": StackType.Bool,
              "@any": StackType.Any,
            }[this.#peek().value as string];
          } else {
            return new TSError(
              {
                startPos: this.#peek().startPos,
                endPos: this.#peek().endPos,
              },
              "expected a `@int`, `@float`, `@str`, `@bool` or `@any` after function parameters"
            );
          }

          // finally, a opening bracket is needed
          if (!this.#expect(TokenType.OpenBracket)) {
            return new TSError(
              {
                startPos: this.#peek().startPos,
                endPos: this.#peek().endPos,
              },
              "expected an opening bracket `{` after a `function` declaration"
            );
          }

          const innerBlock = this.#parseStatement(
            false,
            isInLoop,
            isInIf,
            true
          );

          if (isTSError(innerBlock)) {
            return innerBlock;
          }

          this.newFunctions.push({
            name,
            type: functionType,
          });
          this.functions[functionType][name] = {
            params: params,
            body: innerBlock,
          };
          continue;
        }

        return new TSError(
          {
            startPos: current.startPos,
            endPos: current.endPos,
          },
          "unknown keyword `{}`",
          current.value
        );
      }

      return new TSError(
        {
          startPos: current.startPos,
          endPos: current.endPos,
        },
        "unknown token `{}`",
        current.value
      );
    }

    if (this.#isAtEnd() && !isInRoot) {
      return new TSError(
        {
          startPos: this.#peek().startPos,
          endPos: this.#peek().endPos,
        },
        "expected an ending bracket `}`"
      );
    }

    return block;
  }

  #isAtEnd(): boolean {
    return this.tokens[this.pointer].type === TokenType.EOF;
  }
  #peek(): Token {
    if (this.#isAtEnd()) {
      return this.tokens[this.tokens.length - 1];
    }
    return this.tokens[this.pointer];
  }
  #increment() {
    this.pointer += 1;
  }
  #expect(type: TokenType, value?: string): boolean {
    this.#increment();
    if (this.#isAtEnd()) {
      return false;
    }
    return (
      this.#peek().type === type &&
      (!value || (value && value === this.#peek().value))
    );
  }
}
