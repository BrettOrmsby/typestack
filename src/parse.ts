import { TokenType, Token, Pos, Keyword } from "./scan.js";
import { type StackFunctions } from "./functions.js";
import { type StackTypes, stackTypes } from "./stack.js";
import { TSError, isTSError } from "./utils/error.js";
import { UnionSubset } from "./utils/types.js";
import includes from "./utils/includes.js";

type ExpressionType = UnionSubset<
  TokenType,
  "int" | "float" | "str" | "bool" | "identifier" | "keyword"
>;

export type StatementType = "forLoop" | "whileLoop" | "loop" | "if";

interface Statement {
  type: StatementType;
  startPos: Pos;
  endPos: Pos;
  block: Program;
}

interface ForLoopStatement extends Statement {
  type: "forLoop";
}
interface WhileLoopStatement extends Statement {
  type: "whileLoop";
}
interface LoopStatement extends Statement {
  type: "loop";
}
interface IfStatement extends Statement {
  type: "if";
  else?: Program;
}

export type Statements =
  | ForLoopStatement
  | WhileLoopStatement
  | LoopStatement
  | IfStatement;

export type Program = Array<Token<ExpressionType> | Statements>;

export class Parser {
  tokens: Token<TokenType>[];
  pointer: number;
  functions: StackFunctions;
  newFunctions: { name: string; type: StackTypes }[];
  program: Program;
  errors: TSError[];

  constructor(tokens: Token<TokenType>[], functions: StackFunctions) {
    this.tokens = tokens;
    this.functions = functions;
    this.newFunctions = [];
    this.pointer = 0;
    this.program = [];
    this.errors = [];
  }
  async parse(): Promise<TSError[]> {
    await this.#parseImports();

    const block = this.#parseStatement(true);
    this.program = block;

    return this.errors;
  }

  async #parseImports() {
    this.#decrement();

    while (this.pointer < 0 || !this.#isAtEnd()) {
      if (this.#expect("keyword", "import")) {
        this.#increment();

        if (this.#expect("identifier")) {
          this.#increment();

          // dynamically import the file and add the module functions to the functions
          try {
            const module = (await import(`./modules/${this.#peek().value}.js`))
              .default as unknown as StackFunctions;

            for (const stack of stackTypes) {
              for (const key in module[stack]) {
                this.functions[stack][this.#peek().value + "." + key] =
                  module[stack][key];
              }
            }
          } catch (_) {
            this.errors.push(
              new TSError(
                {
                  startPos: this.#peek().startPos,
                  endPos: this.#peek().endPos,
                },
                "unable to import module"
              )
            );
          }
        } else {
          this.#increment();
          this.errors.push(
            new TSError(
              {
                startPos: this.#peek().startPos,
                endPos: this.#peek().endPos,
              },
              "expected an identifier after an `import` keyword"
            )
          );
          this.#decrement();
        }
      } else {
        this.#increment();
        return;
      }
    }
  }

  #parseStatement(
    isInRoot: boolean,
    isInLoop = false,
    isInFunction = false
  ): Program {
    // increment past the `{` character
    if (!isInRoot && this.#peek().type === "openBracket") {
      this.#increment();
    }

    const block: Program = [];
    while (!this.#isAtEnd()) {
      const current = this.#peek();

      // Punctuation should not be in the middle of nowhere
      const puncTokens: UnionSubset<
        TokenType,
        "openBracket" | "closeParen" | "openParen" | "colon"
      >[] = ["openBracket", "closeParen", "openParen", "colon"];
      if (includes(puncTokens, current.type)) {
        this.errors.push(
          new TSError(
            {
              startPos: current.startPos,
              endPos: current.endPos,
            },
            "unexpected character"
          )
        );
        this.#increment();
        continue;
      }

      // literals become expressions
      const literalTokens: Exclude<ExpressionType, "keyword">[] = [
        "int",
        "float",
        "str",
        "bool",
        "identifier",
      ];
      if (includes(literalTokens, current.type)) {
        block.push(current);
        this.#increment();
        continue;
      }

      // return the block when hitting a `}` unless in the root witch would be an error
      if ("closeBracket" === current.type) {
        if (isInRoot) {
          this.errors.push(
            new TSError(
              {
                startPos: current.startPos,
                endPos: current.endPos,
              },
              "unexpected character"
            )
          );
          this.#increment();
          continue;
        }
        this.#increment();
        return block;
      }

      if ("keyword" === current.type) {
        // stack types become expressions
        const mainTypeKeywords: UnionSubset<
          Keyword,
          "int" | "str" | "float" | "bool"
        >[] = ["int", "str", "float", "bool"];
        if (includes(mainTypeKeywords, current.value)) {
          block.push(current);
          this.#increment();
          continue;
        }

        // At keyword are invalid
        const atKeywords: UnionSubset<
          Keyword,
          "@int" | "@float" | "@str" | "@bool" | "@any"
        >[] = ["@int", "@bool", "@str", "@float", "@any"];
        if (includes(atKeywords, current.value)) {
          this.errors.push(
            new TSError(
              {
                startPos: current.startPos,
                endPos: current.endPos,
              },
              "unexpected keyword `{}`. Keyword `{}` must only be found after parameters in a function declaration",
              current.value,
              current.value
            )
          );
          this.#increment();
          continue;
        }

        // else is invalid
        if ("else" === current.value) {
          this.errors.push(
            new TSError(
              {
                startPos: current.startPos,
                endPos: current.endPos,
              },
              "unexpected keyword `else`. Keyword `else` must only be found after if statements"
            )
          );
          this.#increment();
          continue;
        }

        // any can only be found in functions
        if ("any" === current.value) {
          if (isInFunction) {
            block.push(current);
          } else {
            this.errors.push(
              new TSError(
                {
                  startPos: current.startPos,
                  endPos: current.endPos,
                },
                "unexpected keyword `any`. Keyword `any` must only be found in `@any` functions"
              )
            );
          }
          this.#increment();
          continue;
        }

        // break can only be found in loops
        if ("break" === current.value) {
          if (isInLoop) {
            block.push(current);
          } else {
            this.errors.push(
              new TSError(
                {
                  startPos: current.startPos,
                  endPos: current.endPos,
                },
                "unexpected keyword `break`. Keyword `break` must only be found in loops"
              )
            );
          }
          this.#increment();
          continue;
        }

        // continue can only be found in loops
        if ("continue" === current.value) {
          if (isInLoop) {
            block.push(current);
          } else {
            this.errors.push(
              new TSError(
                {
                  startPos: current.startPos,
                  endPos: current.endPos,
                },
                "unexpected keyword `continue`. Keyword `continue` must only be found in loops"
              )
            );
          }
          this.#increment();
          continue;
        }

        // import is invalid unless at th top of the program
        if ("import" === current.value) {
          this.errors.push(
            new TSError(
              {
                startPos: current.startPos,
                endPos: current.endPos,
              },
              "unexpected keyword `import`. Keyword `import` must only be found at the top of programs"
            )
          );
          this.#increment();
          continue;
        }

        // parsing statements

        if ("loop" === current.value) {
          const startPos = current.startPos;
          const endPos = current.endPos;

          // opening bracket should follow a loop keyword
          if (this.#expect("openBracket")) {
            this.#increment();
          } else {
            this.#increment();
            this.errors.push(
              new TSError(
                {
                  startPos: this.#peek().startPos,
                  endPos: this.#peek().endPos,
                },
                "expected an opening bracket `{` after a `loop` keyword"
              )
            );
          }

          const innerBlock = this.#parseStatement(false, true, isInFunction);

          block.push({
            startPos,
            endPos,
            type: "loop",
            block: innerBlock,
          });
          continue;
        }

        if ("for" === current.value) {
          const startPos = current.startPos;

          // loop and an opening bracket should follow a for keyword
          if (this.#expect("keyword", "loop")) {
            this.#increment();
          } else {
            this.#increment();
            this.errors.push(
              new TSError(
                {
                  startPos: this.#peek().startPos,
                  endPos: this.#peek().endPos,
                },
                "expected a `loop` keyword after a `for` keyword"
              )
            );
            this.#decrement();
          }

          const endPos = this.#peek().endPos;

          if (this.#expect("openBracket")) {
            this.#increment();
          } else {
            this.#increment();
            this.errors.push(
              new TSError(
                {
                  startPos: this.#peek().startPos,
                  endPos: this.#peek().endPos,
                },
                "expected an opening bracket `{` after a `loop` keyword"
              )
            );
          }

          const innerBlock = this.#parseStatement(false, true, isInFunction);

          block.push({
            startPos,
            endPos,
            type: "forLoop",
            block: innerBlock,
          });
          continue;
        }

        if ("while" === current.value) {
          const startPos = current.startPos;

          // loop and an opening bracket should follow a while keyword
          if (this.#expect("keyword", "loop")) {
            this.#increment();
          } else {
            this.#increment();
            this.errors.push(
              new TSError(
                {
                  startPos: this.#peek().startPos,
                  endPos: this.#peek().endPos,
                },
                "expected a `loop` keyword after a `while` keyword"
              )
            );
            this.#decrement();
          }

          const endPos = this.#peek().endPos;

          if (this.#expect("openBracket")) {
            this.#increment();
          } else {
            this.#increment();
            this.errors.push(
              new TSError(
                {
                  startPos: this.#peek().startPos,
                  endPos: this.#peek().endPos,
                },
                "expected an opening bracket `{` after a `loop` keyword"
              )
            );
          }

          const innerBlock = this.#parseStatement(false, true, isInFunction);

          block.push({
            startPos,
            endPos,
            type: "whileLoop",
            block: innerBlock,
          });
          continue;
        }

        if ("if" === current.value) {
          const startPos = current.startPos;
          const endPos = current.endPos;

          // an opening bracket should follow an if
          if (this.#expect("openBracket")) {
            this.#increment();
          } else {
            this.#increment();
            this.errors.push(
              new TSError(
                {
                  startPos: this.#peek().startPos,
                  endPos: this.#peek().endPos,
                },
                "expected an opening bracket `{` after an `if` keyword"
              )
            );
          }

          const innerBlock = this.#parseStatement(
            false,
            isInLoop,
            isInFunction
          );

          // an optional else keyword can follow with an opening bracket
          this.pointer -= 1;
          if (this.#expect("keyword", "else")) {
            this.#increment();

            if (this.#expect("openBracket")) {
              this.#increment();
            } else {
              this.#increment();
              this.errors.push(
                new TSError(
                  {
                    startPos: this.#peek().startPos,
                    endPos: this.#peek().endPos,
                  },
                  "expected an opening bracket `{` after an `else` keyword"
                )
              );
            }

            const elseBlock = this.#parseStatement(
              false,
              isInLoop,
              isInFunction
            );

            block.push({
              startPos,
              endPos,
              type: "if",
              block: innerBlock,
              else: elseBlock,
            });
            continue;
          }
          this.#increment();

          block.push({
            startPos,
            endPos,
            type: "if",
            block: innerBlock,
          });
          continue;
        }

        if ("fn" === current.value) {
          // functions must not be nestled
          if (!isInRoot) {
            this.errors.push(
              new TSError(
                {
                  startPos: current.startPos,
                  endPos: current.endPos,
                },
                "unexpected `fn` keyword. Function declarations must not be nestled in other statements"
              )
            );
          }
          let isErrorWithFunction = false;

          // the name of the function (identifier) should follow
          if (this.#expect("identifier")) {
            this.#increment();
          } else {
            // having an invalid identifier name will cause a problem with the function
            isErrorWithFunction = true;
            this.#increment();
            this.errors.push(
              new TSError(
                {
                  startPos: this.#peek().startPos,
                  endPos: this.#peek().endPos,
                },
                "expected an identifier after a `fn` keyword"
              )
            );
            this.#decrement();
          }
          // the name of the function if there is no error
          const name = this.#peek().value as string;

          // an opening parenthesis should follow
          if (this.#expect("openParen")) {
            this.#increment();
          } else {
            // forgetting an open paren will NOT cause a problem with the function
            this.#increment();
            this.errors.push(
              new TSError(
                {
                  startPos: this.#peek().startPos,
                  endPos: this.#peek().endPos,
                },
                "expected an opening parenthesis `(` after a function identifier"
              )
            );
            this.#decrement();
          }

          const params: Record<string, StackTypes> = {};

          // get all the parameters from the function
          while (
            !this.#isAtEnd() &&
            !this.#expect("EOF") &&
            !this.#expect("closeParen") &&
            this.#peek().type !== "closeParen"
          ) {
            if (!this.#expect("identifier")) {
              this.#increment();
              this.errors.push(
                new TSError(
                  {
                    startPos: this.#peek().startPos,
                    endPos: this.#peek().endPos,
                  },
                  "expected an identifier or closing bracket `)` within a function's opening bracket `(`"
                )
              );
              continue;
            }

            // name of the parameter
            this.#increment();
            const name = this.#peek().value as string;
            if (name in params) {
              this.errors.push(
                new TSError(
                  {
                    startPos: this.#peek().startPos,
                    endPos: this.#peek().endPos,
                  },
                  "duplicate parameter name. Function parameters must have unique names"
                )
              );
            }
            // parameters can have a type associated with them separated by a colon
            if (this.#expect("colon")) {
              this.#increment();
              this.#increment();
              const typeKeywords: UnionSubset<Keyword, StackTypes>[] = [
                "int",
                "str",
                "float",
                "bool",
                "any",
              ];
              if (
                this.#peek().type === "keyword" &&
                includes(typeKeywords, this.#peek().value)
              ) {
                params[name] = this.#peek().value as StackTypes;
              } else {
                // a function without a type is not invalid
                this.errors.push(
                  new TSError(
                    {
                      startPos: this.#peek().startPos,
                      endPos: this.#peek().endPos,
                    },
                    "expected a type `int`, `float`, `str`, `bool` or `any` after a colon for a function parameter"
                  )
                );
                this.#decrement();
              }
            } else {
              // parameters without a colon are `any` type
              params[name] = "any";
            }
          }

          this.#increment();
          if (this.#isAtEnd()) {
            this.errors.push(
              new TSError(
                {
                  startPos: this.#peek().startPos,
                  endPos: this.#peek().endPos,
                },
                "expected a closing parenthesis `)`"
              )
            );
          } else {
            this.#increment();
          }

          let functionType: StackTypes;

          // a function type should follow
          const atKeywords: UnionSubset<
            Keyword,
            "@int" | "@float" | "@str" | "@bool" | "@any"
          >[] = ["@int", "@bool", "@str", "@float", "@any"];
          if (
            !this.#isAtEnd() &&
            this.#peek().type === "keyword" &&
            includes(atKeywords, this.#peek().value)
          ) {
            const atKeywordToStackTypes: Record<
              typeof atKeywords[number],
              StackTypes
            > = {
              "@int": "int",
              "@float": "float",
              "@str": "str",
              "@bool": "bool",
              "@any": "any",
            };
            functionType = atKeywordToStackTypes[this.#peek().value as string];
          } else {
            // a function without a type is invalid
            isErrorWithFunction = true;
            this.errors.push(
              new TSError(
                {
                  startPos: this.#peek().startPos,
                  endPos: this.#peek().endPos,
                },
                "expected a `@int`, `@float`, `@str`, `@bool` or `@any` after function parameters"
              )
            );
            this.#decrement();
          }

          // finally, a opening bracket is needed
          if (this.#expect("openBracket")) {
            this.#increment();
          } else {
            this.#increment();
            this.errors.push(
              new TSError(
                {
                  startPos: this.#peek().startPos,
                  endPos: this.#peek().endPos,
                },
                "expected an opening bracket `{` after a `function` declaration"
              )
            );
          }

          const innerBlock = this.#parseStatement(false, isInLoop, true);

          if (!isErrorWithFunction) {
            this.newFunctions.push({
              name,
              type: functionType,
            });
            this.functions[functionType][name] = {
              params: params,
              body: innerBlock,
            };
          }
          continue;
        }

        this.errors.push(
          new TSError(
            {
              startPos: current.startPos,
              endPos: current.endPos,
            },
            "unknown keyword `{}`",
            current.value
          )
        );
        this.#increment();
        continue;
      }

      this.errors.push(
        new TSError(
          {
            startPos: current.startPos,
            endPos: current.endPos,
          },
          "unknown token `{}`",
          current.value
        )
      );
      this.#increment();
      continue;
    }

    if (this.#isAtEnd() && !isInRoot) {
      this.errors.push(
        new TSError(
          {
            startPos: this.#peek().startPos,
            endPos: this.#peek().endPos,
          },
          "expected an ending bracket `}`"
        )
      );
    }

    return block;
  }

  #isAtEnd(): boolean {
    return this.tokens[this.pointer].type === "EOF";
  }
  #peek(): Token<TokenType> {
    if (this.#isAtEnd()) {
      return this.tokens[this.tokens.length - 1];
    }
    return this.tokens[this.pointer];
  }
  #increment() {
    this.pointer += 1;
  }
  #decrement() {
    this.pointer -= 1;
  }
  #expect(type: TokenType, value?: string): boolean {
    this.#increment();
    if (this.#isAtEnd()) {
      this.#decrement();
      return type === "EOF";
    }
    const isExpected =
      this.#peek().type === type &&
      (!value || (value && value === this.#peek().value));
    this.#decrement();
    return isExpected;
  }
}
