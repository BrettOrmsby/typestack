import { Program } from "./parse.js";
import { StackFunctions, functionToText } from "./functions.js";
import { stacks, StackTypes } from "./stack.js";
import { TSError, isTSError } from "./utils/error.js";

export default class {
  program: Program;
  functions: StackFunctions;
  consoleFunc: (string: string) => void;

  constructor(
    program: Program,
    functions: StackFunctions,
    consoleFunc: (string: string) => void
  ) {
    this.program = program;
    this.functions = functions;
    this.consoleFunc = consoleFunc;
  }

  async run(): Promise<TSError | void> {
    const runError = await this.runProgram(this.program, {}, "int");
    if (isTSError(runError)) {
      return runError;
    }
  }

  async runProgram(
    program: Program,
    params: Record<
      string,
      { value: string | boolean | number; type: StackTypes }
    >,
    stack: StackTypes
  ): Promise<TSError | true | void> {
    const startStack = stack;
    for (const item of program) {
      // if it is an expression
      if ("value" in item) {
        if (item.type === "identifier") {
          const value = item.value as string;

          // if the identifier is a parameter variable or function
          if (value in params) {
            // add the parameter to the stack
            const param = params[value];
            stack = param.type;
            stacks[param.type].push(param.value);
          } else {
            // get the function from the `functions` first looking for the specific type and then in the `any` type
            let stackFunction = this.functions[stack][value];
            let errorStackType = stack;

            if (!stackFunction) {
              stackFunction = this.functions.any[value];
              errorStackType = "any";
            }
            const functionParams = {};

            // get the parameters for the function and change the `any` type to the current stack
            for (const key in stackFunction.params) {
              const stackOfParam =
                stackFunction.params[key] === "any"
                  ? stack
                  : stackFunction.params[key];
              if (!stacks[stackOfParam].check()) {
                return new TSError(
                  {
                    startPos: item.startPos,
                    endPos: item.endPos,
                  },
                  "unable to call function `{}`. Expected more parameters",
                  functionToText(value, errorStackType, stackFunction)
                );
              }
              functionParams[key] = {
                value: stacks[stackOfParam].get(),
                type: stackOfParam,
              };
            }

            // run the body as a program if it is made in TypeStack
            if (stackFunction.body) {
              const functionResult = await this.runProgram(
                stackFunction.body,
                functionParams,
                stack
              );
              if (isTSError(functionResult)) {
                return new TSError(
                  {
                    startPos: item.startPos,
                    endPos: item.endPos,
                  },
                  "error at function `{}`\n{}",
                  functionToText(value, errorStackType, stackFunction),
                  functionResult.error.trim().replace(/^/gm, "  ")
                );
              }
            }

            // run the raw javascript code if it is made in javascript
            if (stackFunction.rawCode) {
              // only need the value per param for running js functions, we don't need the type
              Object.keys(functionParams).forEach((key) => {
                functionParams[key] = functionParams[key].value;
              });
              let functionResult = stackFunction.rawCode(
                stacks,
                functionParams,
                stack,
                this.consoleFunc
              );
              if (functionResult instanceof Promise) {
                functionResult = await functionResult;
              }
              if (functionResult instanceof Error) {
                return new TSError(
                  {
                    startPos: item.startPos,
                    endPos: item.endPos,
                  },
                  "error at function `{}`\n{}",
                  functionToText(value, errorStackType, stackFunction),
                  functionResult.message.trim().replace(/^/gm, "  ")
                );
              }
            }
          }
        } else if (item.type === "keyword") {
          // switch stacks for the most part
          switch (item.value as string) {
            case "int":
              stack = "int";
              break;
            case "float":
              stack = "float";
              break;
            case "str":
              stack = "str";
              break;
            case "bool":
              stack = "bool";
              break;
            case "any":
              stack = startStack;
              break;
            // return from the program on continue
            case "continue":
              return;
            // return true to signify a break
            case "break":
              return true;
          }
        } else {
          // Expression is a bool, str, float or int so just add it and switch stacks
          const stackType = item.type as StackTypes;
          stack = stackType;
          stacks[stackType].push(item.value);
        }
      } else {
        // if it is a statement
        if (item.type === "loop") {
          // run the result to start the condition for the while loop that repeats until there is an error or break returned
          let resultOfIteration = await this.runProgram(
            item.block,
            params,
            stack
          );
          while (!resultOfIteration) {
            resultOfIteration = await this.runProgram(
              item.block,
              params,
              stack
            );
          }
          if (isTSError(resultOfIteration)) {
            return resultOfIteration;
          }
        } else if (item.type === "forLoop") {
          if (!stacks.int.check()) {
            return new TSError(
              {
                startPos: item.startPos,
                endPos: item.endPos,
              },
              "expected an `int` on the stack"
            );
          }

          let resultOfIteration: TSError | true | void;

          // repeat while there is no error or break and the top of the int stack is not 0
          while (!resultOfIteration && stacks.int.peek() !== 0) {
            resultOfIteration = await this.runProgram(
              item.block,
              params,
              "int"
            );

            if (isTSError(resultOfIteration)) {
              return resultOfIteration;
            }
            if (resultOfIteration) {
              break;
            }

            // increment or decrement the top of the int stack so it is closer to 0
            if (!stacks.int.check()) {
              return new TSError(
                {
                  startPos: item.startPos,
                  endPos: item.endPos,
                },
                "expected an `int` on the stack"
              );
            } else {
              const top = stacks.int.get();
              if (top > 0) {
                stacks.int.push(top - 1);
              } else if (top < 0) {
                stacks.int.push(top + 1);
              }
            }
          }

          // move to the int stack on exit
          stack = "int";
        } else if (item.type === "wileLoop") {
          if (!stacks.bool.check()) {
            return new TSError(
              {
                startPos: item.startPos,
                endPos: item.endPos,
              },
              "expected a `bool` on the stack"
            );
          }

          let resultOfIteration: TSError | true | void;

          // repeat while the top of the bool stack is true and there is no error or break
          while (!resultOfIteration && stacks.bool.get()) {
            resultOfIteration = await this.runProgram(
              item.block,
              params,
              "bool"
            );

            if (isTSError(resultOfIteration)) {
              return resultOfIteration;
            }
            if (resultOfIteration) {
              break;
            }

            if (!stacks.bool.check()) {
              return new TSError(
                {
                  startPos: item.startPos,
                  endPos: item.endPos,
                },
                "expected a `bool` on the stack"
              );
            }
          }

          // move to the bool stack on exit
          stack = "bool";
        } else if (item.type === "if") {
          if (!stacks.bool.check()) {
            return new TSError(
              {
                startPos: item.startPos,
                endPos: item.endPos,
              },
              "expected a `bool` on the stack"
            );
          }

          // run the if block if the top of the bool stack is true or else try to run the else block
          if (stacks.bool.get()) {
            const blockResult = await this.runProgram(
              item.block,
              params,
              "bool"
            );
            if (blockResult) {
              return blockResult;
            }
          } else if (item.else) {
            const blockResult = await this.runProgram(
              item.else,
              params,
              "bool"
            );
            if (blockResult) {
              return blockResult;
            }
          }

          // move to the bool stack on exit
          stack = "bool";
        }
      }
    }
  }
}
