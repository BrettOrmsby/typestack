import { TokenType, Token, Pos } from "./scan.js";
import { type StackFunctions } from "./functions.js";
import { StackType } from "./stack.js";

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

  parse(): Error | void {
    const block = this.#parseStatement(true);
    if (block instanceof Error) {
      return block;
    }
    this.program = block;
  }

  #parseStatement(
    isInRoot: boolean,
    isInLoop = false,
    isInIf = false,
    isInFunction = false
  ): Error | Program {
    // startPos is used for the bracket pair error
    const startPos = this.#peek().startPos;

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
        return new Error(
          `${current.startPos.line}:${current.startPos.char} Unexpected character: \`${current.value}\``
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
          return new Error(
            `${current.startPos.line}:${current.startPos.char} Unexpected character: \`${current.value}\``
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
          return new Error(
            `${current.startPos.line}:${current.startPos.char} Unexpected keyword \`${current.value}\`. Keyword \`${current.value}\` must only be found after function declarations`
          );
        }

        // Else is invalid
        if ("else" === current.value) {
          return new Error(
            `${current.startPos.line}:${current.startPos.char} Unexpected keyword \`else\`. Keyword \`else\` must only be found after an if statement`
          );
        }

        // any can only be found in functions
        if ("any" === current.value) {
          if (isInFunction) {
            block.push(current as Expression);
            this.#increment();
            continue;
          } else {
            return new Error(
              `${current.startPos.line}:${current.startPos.char} Unexpected keyword \`any\`. Keyword \`any\` must only be found in \`any\` functions`
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
            return new Error(
              `${current.startPos.line}:${current.startPos.char} Unexpected keyword \`break\`. Keyword \`break\` must only be found in loops`
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
            return new Error(
              `${current.startPos.line}:${current.startPos.char} Unexpected keyword \`continue\`. Keyword \`continue\` must only be found in loops`
            );
          }
        }

        // parsing statements

        if ("loop" === current.value) {
          const startPos = current.startPos;

          // opening bracket should follow a loop keyword
          if (!this.#expect(TokenType.OpenBracket)) {
            return new Error(
              `${this.#peek().startPos.line}:${
                this.#peek().startPos.char
              } Expected an opening bracket (\`{\`) after a loop statement`
            );
          }

          const innerBlock = this.#parseStatement(
            false,
            true,
            isInIf,
            isInFunction
          );

          if (innerBlock instanceof Error) {
            return innerBlock;
          }

          block.push({
            startPos: startPos,
            type: StatementType.Loop,
            block: innerBlock,
          });
          continue;
        }

        if ("for" === current.value) {
          const startPos = current.startPos;

          // loop and an opening bracket should follow a for keyword
          if (!this.#expect(TokenType.Keyword, "loop")) {
            return new Error(
              `${this.#peek().startPos.line}:${
                this.#peek().startPos.char
              } Expected a \`loop\` keyword after a \`for\` keyword`
            );
          }
          if (!this.#expect(TokenType.OpenBracket)) {
            return new Error(
              `${this.#peek().startPos.line}:${
                this.#peek().startPos.char
              } Expected an opening bracket (\`{\`) after a for loop statement`
            );
          }

          const innerBlock = this.#parseStatement(
            false,
            true,
            isInIf,
            isInFunction
          );

          if (innerBlock instanceof Error) {
            return innerBlock;
          }

          block.push({
            startPos: startPos,
            type: StatementType.ForLoop,
            block: innerBlock,
          });
          continue;
        }

        if ("while" === current.value) {
          const startPos = current.startPos;

          // loop and an opening bracket should follow a while keyword
          if (!this.#expect(TokenType.Keyword, "loop")) {
            return new Error(
              `${this.#peek().startPos.line}:${
                this.#peek().startPos.char
              } Expected a \`loop\` keyword after a \`while\` keyword`
            );
          }
          if (!this.#expect(TokenType.OpenBracket)) {
            return new Error(
              `${this.#peek().startPos.line}:${
                this.#peek().startPos.char
              } Expected an opening bracket (\`{\`) after a while loop statement`
            );
          }

          const innerBlock = this.#parseStatement(
            false,
            true,
            isInIf,
            isInFunction
          );

          if (innerBlock instanceof Error) {
            return innerBlock;
          }

          block.push({
            startPos: startPos,
            type: StatementType.WhileLoop,
            block: innerBlock,
          });
          continue;
        }

        if ("if" === current.value) {
          const startPos = current.startPos;

          // an opening bracket should follow an if
          if (!this.#expect(TokenType.OpenBracket)) {
            return new Error(
              `${this.#peek().startPos.line}:${
                this.#peek().startPos.char
              } Expected an opening bracket (\`{\`) after an if statement`
            );
          }

          const innerBlock = this.#parseStatement(
            false,
            isInLoop,
            true,
            isInFunction
          );

          if (innerBlock instanceof Error) {
            return innerBlock;
          }

          // an optional else keyword can follow with an opening bracket
          this.pointer -= 1;
          if (this.#expect(TokenType.Keyword, "else")) {
            if (!this.#expect(TokenType.OpenBracket)) {
              return new Error(
                `${this.#peek().startPos.line}:${
                  this.#peek().startPos.char
                } Expected an opening bracket (\`{\`) after an else statement`
              );
            }

            const elseBlock = this.#parseStatement(
              false,
              isInLoop,
              true,
              isInFunction
            );

            if (elseBlock instanceof Error) {
              return elseBlock;
            }

            block.push({
              startPos: startPos,
              type: StatementType.If,
              block: innerBlock,
              else: elseBlock,
            });
            continue;
          }
          block.push({
            startPos: startPos,
            type: StatementType.If,
            block: innerBlock,
          });
          continue;
        }

        if ("fn" === current.value) {
          // functions must not be nestled
          if (!isInRoot) {
            return new Error(
              `${current.startPos.line}:${current.startPos.char} Function declarations must not be nestles in other statements`
            );
          }

          // the name of the function (identifier) should follow
          if (!this.#expect(TokenType.Identifier)) {
            return new Error(
              `${this.#peek().startPos.line}:${
                this.#peek().startPos.char
              } Expected a identifier after a \`fn\` keyword`
            );
          }
          const name = this.#peek().value as string;

          // an opening parenthesis should follow
          if (!this.#expect(TokenType.OpenParen)) {
            return new Error(
              `${this.#peek().startPos.line}:${
                this.#peek().startPos.char
              } Expected an opening parenthesis (\`(\`) after a function identifier`
            );
          }

          const parenStartPos = this.#peek().startPos;

          const params: Record<string, StackType> = {};

          // get all the parameters from the function
          while (!this.#isAtEnd() && !this.#expect(TokenType.CloseParen)) {
            this.pointer -= 1;
            if (!this.#expect(TokenType.Identifier)) {
              return new Error(
                `${this.#peek().startPos.line}:${
                  this.#peek().startPos.char
                } Expected an identifier or parenthesis (\`(\`) after a opening parenthesis (\`(\`) of a function`
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
              }
            } else {
              this.pointer -= 1;
              params[name] = StackType.Any;
            }
          }

          if (this.#isAtEnd()) {
            return new Error(
              `${parenStartPos.line}:${parenStartPos.char} Expected ending parenthesis pair`
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
            return new Error(
              `${this.#peek().startPos.line}:${
                this.#peek().startPos.char
              } Expected a function type (\`@int\`, \`@str\`, \`@float\`, \`@bool\`, \`@any\`) after a function declaration`
            );
          }

          // finally, a opening bracket is needed
          if (!this.#expect(TokenType.OpenBracket)) {
            return new Error(
              `${this.#peek().startPos.line}:${
                this.#peek().startPos.char
              } Expected an opening bracket (\`{\`) after a function declaration`
            );
          }

          const innerBlock = this.#parseStatement(
            false,
            isInLoop,
            isInIf,
            true
          );

          if (innerBlock instanceof Error) {
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

        return new Error(
          `${current.startPos.line}:${current.startPos.char} Unknown keyword: \`${current.value}\``
        );
      }

      return new Error(
        `${current.startPos.line}:${current.startPos.char} Unknown token: \`${current.value}\``
      );
    }

    if (this.#isAtEnd() && !isInRoot) {
      return new Error(
        `${startPos.line}:${startPos.char} Expected ending bracket pair`
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
