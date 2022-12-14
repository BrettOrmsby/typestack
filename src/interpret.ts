import { TokenType } from "./scan.js";
import { Program, StatementType } from "./parse.js";
import { StackFunctions } from "./functions.js";
import { stacks, StackType} from "./stack.js";

export default function interpret(program: Program, functions: StackFunctions): Error | void {
    const runError = runProgram(program, {}, StackType.Int, functions);
    if(runError && runError.error) {
        return runError.error;
    }
}

function runProgram(program: Program, params: Record<string, {value: string | boolean | number, type: StackType}>, stack: StackType, functions: StackFunctions): {error?: Error, break?: boolean} | void {
    const startStack = stack;
    for(const item of program) {
        // if it is an expression
        if("value" in item) {
            if(item.type === TokenType.Identifier) {
                const value = item.value as string;
                if(value in params) {
                    const param = params[value];
                    stack = param.type;
                    stacks[param.type].push(param.value);
                    
                } else {
                    const stackFunction = functions[stack][value] || functions[StackType.Any][value];
                    const functionParams = {};
                    for(const key in stackFunction.params) {
                        const stackOfParam = stackFunction.params[key] === StackType.Any ? stack : stackFunction.params[key];
                        if(!stacks[stackOfParam].check()) {
                            //TODO: change the error to the full function thing like identifier(param: int) @int
                            return {error: new Error(`Unable to call function ${value} without enough parameters`)};
                        }
                        functionParams[key] = {
                            value: stacks[stackOfParam].get(),
                            type: stackOfParam
                        };
                    }
                    if(stackFunction.body) {
                        const functionResult = runProgram(stackFunction.body, functionParams, stack, functions);
                        if(functionResult && functionResult.error instanceof Error) {
                            return {error: functionResult.error};
                        }
                    }
                    if(stackFunction.rawCode) {
                        // only need the value per param for running js functions
                        Object.keys(functionParams).forEach((key) => {
                            functionParams[key] = functionParams[key].value;
                        });
                        stackFunction.rawCode(stacks, functionParams, stack);
                    }
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
                    stack = startStack;
                    break;
                case "continue":
                    return;
                case "break":
                    return {break:true};
                }
            } else {
                // Expression is a bool, str, float or int
                const stackType = getStackTypeFromTokenType(item.type);
                stack = stackType;
                stacks[stackType].push(item.value);
            }
        } else {
            if(item.type === StatementType.Loop) {
                let resultOfIteration = runProgram(item.block, params, stack, functions);
                while(!resultOfIteration) {
                    resultOfIteration = runProgram(item.block, params, stack, functions);
                }
                if(resultOfIteration.error) {
                    return {error: resultOfIteration.error};
                }
            } else if(item.type === StatementType.ForLoop) {
                if(!stacks[StackType.Int].check()) {
                    return {error: new Error("For loops must have a `int` on the stack to run")};
                }

                let resultOfIteration: {error?: Error, break?: boolean} | void;
                while(!resultOfIteration && stacks[StackType.Int].peek() !== 0) {
                    resultOfIteration = runProgram(item.block, params, StackType.Int, functions);

                    if(resultOfIteration && resultOfIteration.error) {
                        return {error: resultOfIteration.error};
                    }
                    if(resultOfIteration && resultOfIteration.break) {
                        break;
                    }


                    if(!stacks[StackType.Int].check()) {
                        return {error: new Error("For loops must have a `int` on the stack to run")};
                    } else {
                        const top = stacks[StackType.Int].get();
                        if(top > 0) {
                            stacks[StackType.Int].push(top - 1);
                        } else if(top < 0){
                            stacks[StackType.Int].push(top + 1);
                        } 
                    }
                }
                stack = StackType.Int;

            } else if(item.type === StatementType.WhileLoop) {
                if(!stacks[StackType.Bool].check()) {
                    return {error: new Error("While loops must have a `bool` on the stack to run")};
                }

                let resultOfIteration: {error?: Error, break?: boolean} | void;
                while(!resultOfIteration && stacks[StackType.Bool].get()) {
                    resultOfIteration = runProgram(item.block, params, StackType.Bool, functions);

                    if(resultOfIteration && resultOfIteration.error) {
                        return {error: resultOfIteration.error};
                    }
                    if(resultOfIteration && resultOfIteration.break) {
                        break;
                    }

                    if(!stacks[StackType.Bool].check()) {
                        return {error: new Error("While loops must have a `bool` on the stack to run")};
                    }
                }
                stack = StackType.Bool;
            } else if(item.type === StatementType.If) {
                if(!stacks[StackType.Bool].check()) {
                    return {error: new Error("If statements must have a `bool` on the stack to run")};
                }

                if(stacks[StackType.Bool].get()) {
                    const blockResult = runProgram(item.block, params, StackType.Bool, functions);
                    if(blockResult && blockResult.error) {
                        return {error: blockResult.error};
                    }
                    if(blockResult && blockResult.break) {
                        return {break: true};
                    }
                } else if(item.else) {
                    const blockResult = runProgram(item.else, params, StackType.Bool, functions);
                    if(blockResult && blockResult.error) {
                        return {error: blockResult.error};
                    }
                    if(blockResult && blockResult.break) {
                        return {break: true};
                    }
                }
                stack = StackType.Bool;
            } 
        }
    }
}

function getStackTypeFromTokenType(tokenType: TokenType): StackType {
    return {
        [TokenType.Int]: StackType.Int,
        [TokenType.Float]: StackType.Float,
        [TokenType.Str]: StackType.Str,
        [TokenType.Bool]: StackType.Bool
    }[tokenType];
}