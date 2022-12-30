import { TokenType } from "./scan.js";
import { Program, StatementType } from "./parse.js";
import { StackFunctions, functionToText } from "./functions.js";
import { stacks, StackType } from "./stack.js";
import { TSError, isTSError } from "./utils/error.js";

export default async function interpret(
  program: Program,
  functions: StackFunctions
): Promise<TSError | void> {
  const runError = await runProgram(program, {}, StackType.Int, functions);
  if (isTSError(runError)) {
    return runError;
  }
}

async function runProgram(
  program: Program,
  params: Record<string, { value: string | boolean | number; type: StackType }>,
  stack: StackType,
  functions: StackFunctions
): Promise<TSError | true | void> {
  const startStack = stack;
  for (const item of program) {
    // if it is an expression
    if ("value" in item) {
      if (item.type === TokenType.Identifier) {
        const value = item.value as string;

        // if the identifier is a parameter variable or function
        if (value in params) {
          // add the parameter to the stack
          const param = params[value];
          stack = param.type;
          stacks[param.type].push(param.value);
        } else {
          // get the function from the `functions` first looking for the specific type and then in the `any` type
          let stackFunction = functions[stack][value];
          let errorStackType = stack;

          if (!stackFunction) {
            stackFunction = functions[StackType.Any][value];
            errorStackType = StackType.Any;
          }
          const functionParams = {};

          // get the parameters for the function and change the `any` type to the current stack
          for (const key in stackFunction.params) {
            const stackOfParam =
              stackFunction.params[key] === StackType.Any
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
            const functionResult = await runProgram(
              stackFunction.body,
              functionParams,
              stack,
              functions
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
              stack
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
      } else if (item.type === TokenType.Keyword) {
        // switch stacks for the most part
        switch (item.value as string) {
          case "int":
            stack = StackType.Int;
            break;
          case "float":
            stack = StackType.Float;
            break;
          case "str":
            stack = StackType.Str;
            break;
          case "bool":
            stack = StackType.Bool;
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
        const stackType = {
          [TokenType.Int]: StackType.Int,
          [TokenType.Float]: StackType.Float,
          [TokenType.Str]: StackType.Str,
          [TokenType.Bool]: StackType.Bool,
        }[item.type];
        stack = stackType;
        stacks[stackType].push(item.value);
      }
    } else {
      // if it is a statement
      if (item.type === StatementType.Loop) {
        // run the result to start the condition for the while loop that repeats until there is an error or break returned
        let resultOfIteration = await runProgram(
          item.block,
          params,
          stack,
          functions
        );
        while (!resultOfIteration) {
          resultOfIteration = await runProgram(
            item.block,
            params,
            stack,
            functions
          );
        }
        if (isTSError(resultOfIteration)) {
          return resultOfIteration;
        }
      } else if (item.type === StatementType.ForLoop) {
        if (!stacks[StackType.Int].check()) {
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
        while (!resultOfIteration && stacks[StackType.Int].peek() !== 0) {
          resultOfIteration = await runProgram(
            item.block,
            params,
            StackType.Int,
            functions
          );

          if (isTSError(resultOfIteration)) {
            return resultOfIteration;
          }
          if (resultOfIteration) {
            break;
          }

          // increment or decrement the top of the int stack so it is closer to 0
          if (!stacks[StackType.Int].check()) {
            return new TSError(
              {
                startPos: item.startPos,
                endPos: item.endPos,
              },
              "expected an `int` on the stack"
            );
          } else {
            const top = stacks[StackType.Int].get();
            if (top > 0) {
              stacks[StackType.Int].push(top - 1);
            } else if (top < 0) {
              stacks[StackType.Int].push(top + 1);
            }
          }
        }

        // move to the int stack on exit
        stack = StackType.Int;
      } else if (item.type === StatementType.WhileLoop) {
        if (!stacks[StackType.Bool].check()) {
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
        while (!resultOfIteration && stacks[StackType.Bool].get()) {
          resultOfIteration = await runProgram(
            item.block,
            params,
            StackType.Bool,
            functions
          );

          if (isTSError(resultOfIteration)) {
            return resultOfIteration;
          }
          if (resultOfIteration) {
            break;
          }

          if (!stacks[StackType.Bool].check()) {
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
        stack = StackType.Bool;
      } else if (item.type === StatementType.If) {
        if (!stacks[StackType.Bool].check()) {
          return new TSError(
            {
              startPos: item.startPos,
              endPos: item.endPos,
            },
            "expected a `bool` on the stack"
          );
        }

        // run the if block if the top of the bool stack is true or else try to run the else block
        if (stacks[StackType.Bool].get()) {
          const blockResult = await runProgram(
            item.block,
            params,
            StackType.Bool,
            functions
          );
          if (blockResult) {
            return blockResult;
          }
        } else if (item.else) {
          const blockResult = await runProgram(
            item.else,
            params,
            StackType.Bool,
            functions
          );
          if (blockResult) {
            return blockResult;
          }
        }

        // move to the bool stack on exit
        stack = StackType.Bool;
      }
    }
  }
}
