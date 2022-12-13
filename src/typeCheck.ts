import { TokenType } from "./scan.js";
import { StackFunctions } from "./functions.js";
import { Program, StatementType } from "./parse.js";
import { StackType } from "./stack.js";

export default function typeCheck(program: Program, functions: StackFunctions, newFunctions: {name: string, type: StackType}[]): Error | void {
    const isValidCodeError = traverseCheckProgram(program, {}, StackType.Int, functions);

    if(isValidCodeError instanceof Error) {
        return isValidCodeError;
    } 

    for(const fn of newFunctions) {
        const posError = traverseCheckProgram(functions[fn.type][fn.name].body, functions[fn.type][fn.name].params, fn.type, functions);
        if(posError) {
            return posError;
        }
    }
}

function traverseCheckProgram(program: Program, otherIdentifiers: Record<string, StackType>, stack: StackType, functions: StackFunctions): Error | void {
    for(const item of program) {
        // if it is an expression
        if("value" in item) {
            if(item.type === TokenType.Identifier) {
                const value = item.value as string;
                if(value in otherIdentifiers) {
                    stack = otherIdentifiers[value];
                } else if(!(value in functions[stack] || value in functions[StackType.Any])) {
                    return new Error(`${item.startPos.line}:${item.startPos.char} Attempt to call function not found at stack ${stack}: \`${item.value}\``);
                }
            } else if(item.type === TokenType.Keyword) {
                switch(item.value as string) {
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
            } else if(item.type === TokenType.Int) {
                stack = StackType.Int;
            } else if(item.type === TokenType.Float) {
                stack = StackType.Float;
            } else if(item.type === TokenType.Str) {
                stack = StackType.Str;
            } else if(item.type === TokenType.Bool) {
                stack = StackType.Bool;
            }
        } else {
            if(item.type === StatementType.Loop) {
                const result = traverseCheckProgram(item.block, otherIdentifiers, stack, functions);
                if(result) {
                    return result;
                }
            } else if(item.type === StatementType.ForLoop) {
                const result = traverseCheckProgram(item.block, otherIdentifiers, StackType.Int, functions);
                if(result) {
                    return result;
                }
                stack = StackType.Int;
            } else if(item.type === StatementType.WhileLoop) {
                const result = traverseCheckProgram(item.block, otherIdentifiers, StackType.Bool, functions);
                if(result) {
                    return result;
                }
                stack = StackType.Bool;
            } else if(item.type === StatementType.If) {
                const firstBlock = traverseCheckProgram(item.block, otherIdentifiers, StackType.Bool, functions);
                if(item.else) {
                    const secondBlock = traverseCheckProgram(item.block, otherIdentifiers, StackType.Bool, functions);
                    if(secondBlock || firstBlock) {
                        return secondBlock || firstBlock;
                    }
                } else {
                    if(firstBlock) {
                        return firstBlock;
                    }
                }
                stack = StackType.Bool;
            } 
        }
    }
}