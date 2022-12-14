import { TokenType } from "./scan.js";
import { Program, StatementType } from "./parse.js";
import { StackFunctions } from "./functions.js";
import { stacks, StackType} from "./stack.js";

export default function interpret(program: Program, functions: StackFunctions): Error | void {
    const runError = runProgram(program, {}, StackType.Int, functions);
    if(runError instanceof Error) {
        return runError;
    }
}

function runProgram(program: Program, params: Record<string, {value: string | boolean | number, type: StackType}>, stack: StackType, functions: StackFunctions): Error | true | void {
    const startStack = stack;
    for(const item of program) {
        // if it is an expression
        if("value" in item) {
            if(item.type === TokenType.Identifier) {
                const value = item.value as string;

                // if the identifier is a parameter variable or function
                if(value in params) {

                    // add the parameter to the stack
                    const param = params[value];
                    stack = param.type;
                    stacks[param.type].push(param.value);
                } else {

                    // get the function from the `functions` first looking for the specific type and then in the `any` type
                    const stackFunction = functions[stack][value] || functions[StackType.Any][value];
                    const functionParams = {};

                    // get the parameters for the function and change the `any` type to the current stack
                    for(const key in stackFunction.params) {
                        const stackOfParam = stackFunction.params[key] === StackType.Any ? stack : stackFunction.params[key];
                        if(!stacks[stackOfParam].check()) {
                            //TODO: change the error to the full function thing like identifier(param: int) @int
                            return new Error(`Unable to call function ${value} without enough parameters`);
                        }
                        functionParams[key] = {
                            value: stacks[stackOfParam].get(),
                            type: stackOfParam
                        };
                    }

                    // run the body as a program if it is made in TypeStack
                    if(stackFunction.body) {
                        const functionResult = runProgram(stackFunction.body, functionParams, stack, functions);
                        if(functionResult instanceof Error) {
                            return functionResult;
                        }
                    }

                    // run the raw javascript code if it is made in javascript
                    if(stackFunction.rawCode) {
                        // only need the value per param for running js functions, we don't need the type
                        Object.keys(functionParams).forEach((key) => {
                            functionParams[key] = functionParams[key].value;
                        });
                        stackFunction.rawCode(stacks, functionParams, stack);
                    }
                }

            } else if(item.type === TokenType.Keyword) {
                // switch stacks for the most part
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
                    [TokenType.Bool]: StackType.Bool
                }[item.type];
                stack = stackType;
                stacks[stackType].push(item.value);
            }
        } else {
            // if it is a statement
            if(item.type === StatementType.Loop) {

                // run the result to start the condition for the while loop that repeats until there is an error or break returned
                let resultOfIteration = runProgram(item.block, params, stack, functions);
                while(!resultOfIteration) {
                    resultOfIteration = runProgram(item.block, params, stack, functions);
                }
                if(resultOfIteration instanceof Error) {
                    return resultOfIteration;
                }
            } else if(item.type === StatementType.ForLoop) {

                if(!stacks[StackType.Int].check()) {
                    return new Error("For loops must have a `int` on the stack to run");
                }

                let resultOfIteration: Error | true | void;

                // repeat while there is no error or break and the top of the int stack is not 0
                while(!resultOfIteration && stacks[StackType.Int].peek() !== 0) {
                    resultOfIteration = runProgram(item.block, params, StackType.Int, functions);

                    if(resultOfIteration instanceof Error) {
                        return resultOfIteration;
                    }
                    if(resultOfIteration) {
                        break;
                    }

                    // increment or decrement the top of the int stack so it is closer to 0
                    if(!stacks[StackType.Int].check()) {
                        return new Error("For loops must have a `int` on the stack to run");
                    } else {
                        const top = stacks[StackType.Int].get();
                        if(top > 0) {
                            stacks[StackType.Int].push(top - 1);
                        } else if(top < 0){
                            stacks[StackType.Int].push(top + 1);
                        } 
                    }
                }

                // move to the int stack on exit
                stack = StackType.Int;

            } else if(item.type === StatementType.WhileLoop) {

                if(!stacks[StackType.Bool].check()) {
                    return new Error("While loops must have a `bool` on the stack to run");
                }

                let resultOfIteration: Error | true | void;

                // repeat while the top of the bool stack is true and there is no error or break
                while(!resultOfIteration && stacks[StackType.Bool].get()) {
                    resultOfIteration = runProgram(item.block, params, StackType.Bool, functions);

                    if(resultOfIteration instanceof Error) {
                        return resultOfIteration;
                    }
                    if(resultOfIteration) {
                        break;
                    }

                    if(!stacks[StackType.Bool].check()) {
                        return new Error("While loops must have a `bool` on the stack to run");
                    }
                }

                // move to the bool stack on exit
                stack = StackType.Bool;

            } else if(item.type === StatementType.If) {

                if(!stacks[StackType.Bool].check()) {
                    return new Error("If statements must have a `bool` on the stack to run");
                }

                // run the if block if the top of the bool stack is true or else try to run the else block
                if(stacks[StackType.Bool].get()) {
                    const blockResult = runProgram(item.block, params, StackType.Bool, functions);
                    if(blockResult) {
                        return blockResult;
                    }
                } else if(item.else) {
                    const blockResult = runProgram(item.else, params, StackType.Bool, functions);
                    if(blockResult) {
                        return blockResult;
                    }
                }

                // move to the bool stack on exit
                stack = StackType.Bool;
            } 
        }
    }
}