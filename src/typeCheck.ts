import { StackFunctions } from "./functions.js";
import { Program } from "./parse.js";
import { stackTypes, StackTypes } from "./stack.js";
import { TSError } from "./utils/error.js";
import includes from "./utils/includes.js";
import { Writeable } from "./utils/types.js";

export default function typeCheck(
  program: Program,
  functions: StackFunctions,
  newFunctions: { name: string; type: StackTypes }[]
): TSError[] {
  const programTypeErrors = traverseCheckProgram(program, {}, "int", functions);

  let functionErrors = [];
  for (const fn of newFunctions) {
    // overload all `any` type parameters to the function type
    const params = { ...functions[fn.type][fn.name].params };
    if (fn.type !== "any") {
      for (const param in params) {
        if (params[param] === "any") {
          params[param] = fn.type;
        }
      }
    }

    const functionError = traverseCheckProgram(
      functions[fn.type][fn.name].body,
      params,
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
  otherIdentifiers: Record<string, StackTypes>,
  stack: StackTypes,
  functions: StackFunctions
): TSError[] {
  let errors: TSError[] = [];
  for (const item of program) {
    // if it is an expression
    if ("value" in item) {
      if (item.type === "identifier") {
        // The identifier must be in the parameters or a function at the current stack, in the any stack or in each individual stack
        const value = item.value as string;
        if (value in otherIdentifiers) {
          stack = otherIdentifiers[value];
        } else if (
          !(
            value in functions[stack] ||
            value in functions.any ||
            (value in functions.int &&
              value in functions.float &&
              value in functions.str &&
              value in functions.bool)
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
      } else if (item.type === "keyword") {
        // certain keywords change the stack
        if (includes(stackTypes as Writeable<typeof stackTypes>, item.value)) {
          stack = item.value;
        }
        // Type values change the stack
      } else if (
        includes(stackTypes as Writeable<typeof stackTypes>, item.type)
      ) {
        stack = item.type;
      }
    } else {
      // loops only need to check their block with the current type
      if (item.type === "loop") {
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
      } else if (item.type === "forLoop") {
        const result = traverseCheckProgram(
          item.block,
          otherIdentifiers,
          "int",
          functions
        );
        if (result.length > 0) {
          errors = [...errors, ...result];
        }
        stack = "int";

        // while loops need to check their block with the bool type and change to the bool type after
      } else if (item.type === "whileLoop") {
        const result = traverseCheckProgram(
          item.block,
          otherIdentifiers,
          "bool",
          functions
        );
        if (result.length > 0) {
          errors = [...errors, ...result];
        }
        stack = "bool";

        // if statements need to check their blocks with the bool type and turn it to the bool type after
      } else if (item.type === "if") {
        const firstBlock = traverseCheckProgram(
          item.block,
          otherIdentifiers,
          "bool",
          functions
        );
        if (item.else) {
          const secondBlock = traverseCheckProgram(
            item.block,
            otherIdentifiers,
            "bool",
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
        stack = "bool";
      }
    }
  }
  return errors;
}
