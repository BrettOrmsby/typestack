import { TokenType } from "./scan.js";
import { StackFunctions } from "./functions.js";
import { Program, StatementType } from "./parse.js";
import { StackType } from "./stack.js";
import { TSError } from "./utils/error.js";

export default function typeCheck(
  program: Program,
  functions: StackFunctions,
  newFunctions: { name: string; type: StackType }[]
): TSError[] {
  const programTypeErrors = traverseCheckProgram(
    program,
    {},
    StackType.Int,
    functions
  );

  let functionErrors = [];
  for (const fn of newFunctions) {
    const functionError = traverseCheckProgram(
      functions[fn.type][fn.name].body,
      functions[fn.type][fn.name].params,
      fn.type,
      functions
    );
    if (functionError.length > 0) {
      functionErrors = [...functionErrors, ...functionError];
    }
  }
  return [...programTypeErrors, ...functionErrors];
}

function traverseCheckProgram(
  program: Program,
  otherIdentifiers: Record<string, StackType>,
  stack: StackType,
  functions: StackFunctions
): TSError[] {
  let errors: TSError[] = [];
  for (const item of program) {
    // if it is an expression
    if ("value" in item) {
      if (item.type === TokenType.Identifier) {
        // The identifier must be in the parameters or a function at the current stack, in the any stack or in each individual stack
        const value = item.value as string;
        if (value in otherIdentifiers) {
          stack = otherIdentifiers[value];
        } else if (
          !(
            value in functions[stack] ||
            value in functions[StackType.Any] ||
            (value in functions[StackType.Int] &&
              value in functions[StackType.Float] &&
              value in functions[StackType.Str] &&
              value in functions[StackType.Bool])
          )
        ) {
          errors.push(
            new TSError(
              {
                startPos: item.startPos,
                endPos: item.endPos,
              },
              "Attempt to call function not found at stack `{}`",
              stack
            )
          );
        }
      } else if (item.type === TokenType.Keyword) {
        // certain keywords change the stack
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
            stack = StackType.Any;
        }
        // Type values change the stack
      } else if (item.type === TokenType.Int) {
        stack = StackType.Int;
      } else if (item.type === TokenType.Float) {
        stack = StackType.Float;
      } else if (item.type === TokenType.Str) {
        stack = StackType.Str;
      } else if (item.type === TokenType.Bool) {
        stack = StackType.Bool;
      }
    } else {
      // loops only need to check their block with the current type
      if (item.type === StatementType.Loop) {
        const result = traverseCheckProgram(
          item.block,
          otherIdentifiers,
          stack,
          functions
        );
        if (result.length > 0) {
          errors = [...errors, ...result];
        }

        // for loops need to check their block with the int type and change to the int type after
      } else if (item.type === StatementType.ForLoop) {
        const result = traverseCheckProgram(
          item.block,
          otherIdentifiers,
          StackType.Int,
          functions
        );
        if (result.length > 0) {
          errors = [...errors, ...result];
        }
        stack = StackType.Int;

        // while loops need to check their block with the bool type and change to the bool type after
      } else if (item.type === StatementType.WhileLoop) {
        const result = traverseCheckProgram(
          item.block,
          otherIdentifiers,
          StackType.Bool,
          functions
        );
        if (result.length > 0) {
          errors = [...errors, ...result];
        }
        stack = StackType.Bool;

        // if statements need to check their blocks with the bool type and turn it to the bool type after
      } else if (item.type === StatementType.If) {
        const firstBlock = traverseCheckProgram(
          item.block,
          otherIdentifiers,
          StackType.Bool,
          functions
        );
        if (item.else) {
          const secondBlock = traverseCheckProgram(
            item.block,
            otherIdentifiers,
            StackType.Bool,
            functions
          );
          if (secondBlock.length > 0 || firstBlock.length > 0) {
            errors = [...errors, ...secondBlock, ...firstBlock];
          }
        } else {
          if (firstBlock.length > 0) {
            errors = [...errors, ...firstBlock];
          }
        }
        stack = StackType.Bool;
      }
    }
  }
  return errors;
}
