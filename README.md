# TypeStack

**A stack-based, type-safe language** 

> **Warning**
>  This is a work in progress language

## Instillation for CLI

```bash
npm install typestack-lang -g
```

## Running Files via CLI

```bash
typestack filename.txt
```

## Instillation for JavaScript

```bash
npm install typestack-lang
```

## Running TypeStack

```js
import typestack from "typestack-lang/dist/index.js";

await typestack(`
100 for loop {
    dup 15 % 0 ==
    if {
        "FizzBuzz" print drop
    } else {
        int dup 5 % 0 ==
        if {
            "Buzz" print drop
        } else {
            int dup 3 % 0 ==
            if {
                "Fizz" print drop
            } else {
                int print
            }
        }
    }
}
`);
```

## TypeStack Basics

```python
"Hello, World!" print
```

Type stack is a stack-based concatenated language. This introduction assumes you know the basics of at least one programming language and have an understanding of how stacks work.

### TypeStack Stacks

TypeStack has 4 stacks, 1 stack for each type: `int`, `float`, `str` and `bool`. Whenever you use a type value, the stack type changes. The stack type can also change when you use a type keyword: `int`, `float`, `str` or `bool` and enter or exit loops and if statements.

The stack type is important as you can only call functions on certain types and functions are called on the stack type.

### Example FizzBuzz Program

```python
100 for loop {
    dup 15 % 0 ==
    if {
        "FizzBuzz" print drop
    } else {
        int dup 5 % 0 ==
        if {
            "Buzz" print drop
        } else {
            int dup 3 % 0 ==
            if {
                "Fizz" print drop
            } else {
                int print
            }
        }
    }
}
```

### Expressions

* **Type keywords**: keywords that are a type: `int`, `float`, `str`, `bool` or `any` change the stack type.

* **`break`**: exits a loop.

* **`continue`**: stops the current cycle of a loop and continues to the next cycle.

* **Ints**: Any number without a decimal place is an `int` (integer) and is added to the `int` stack. The stack type is also changed to the `int` stack.
  
  ```python
  # valid `int`s
  55 0 123456789
  # invalid `int`s
  -55 55.66
  ```

* **Floats**: Any number with a decimal place is a `float` and is added to the `float` stack. The stack type is also changed to the `float` stack.
  
  ```python
  # valid `floats`s
  5.44 0.0 123456789.987654321
  # invalid `floats`s
  -55.0 .5566 66
  ```

* **Strs**: A `str` is a string of characters denoted by the double quotes `"` and is added to the `str` stack. The stack type is also changed to the `str` stack. `str`s can also have escape characters including `\n` for newlines, `\t` for tabs, `\r` for cartridge returns, `\\` for backslashes and `\"` for double quotes
  
  ```python
  # valid `str`s
  "Hello, World!"
  "Multi
  line
  string
  "
  "string with escape \n codes \""
  # invalid `str`s
  "string with invalid escape code \f"
  "string without ending double quote
  ```

* **Bools**: `true` and `false` are `bool`s (Booleans) and are added to the `bool` stack. The stack type is also changed to the `bool` stack.
  
  ```python
  # valid `bool`s
  true false
  # invalid `bool`s
  True False
  ```

* **Identifiers**: Identifiers are most other values that do not start with a number, double quote, bracket or parenthesis and are not keywords. Identifiers are normally calls to functions but can also be function parameters.
  
  ```python
  # valid identifiers
  value - item2
  # invalid identifiers
  true 33k f()
  ```

### Statements

* **`loop`**: A loop statement repeats its block until it is exited using a `break` expression. The stack type before the loop is the same as the stack type starting the loop block and the same after the loop.
  
  ```python
  # Programs start in the `int` stack
  66
  loop {
      # `int` stack
      1 +
      dup 5 % 0 ==
      if {
          break
      }
  }
  # `int` stack
  ```

* **`while loop`**: A while loop statement repeats its block until the top of the `bool` stack is `false`. The loop consumes the top of the stack each time, meaning that the condition will have to be re-added after each repetition. If there are no `bool`s on the stack then the program will error. The stack type before the loop can be `any` type but the type starting the loop block and leaving the loop is `bool`.
  
  ```python
  # `int` stack
  true
  # `bool` stack
  66
  # `int` stack
  while loop {
      # `bool` stack
      int
      1 +
      # `int` stack
      dup 5 % 0 !=
  }
  ```

* **`for loop`**: A for loop statement repeats its block until the top of the `int` stack is `0`.  At the end of each cycle, the top of the `int` stack is incremented or decremented by `1` so it is closer to `0`. If there are no `int`s on the stack then the program will error. The stack type before the loop can be `any` type but the type starting the loop block and leaving the loop is `int`.
  
  ```python
  # `int` stack
  100
  "Are we there yet?"
  # `str` stack
  for loop {
      # `int` stack
      str print
  }
  ```

* **`if else`**: An if statement runs its block if the top of the `bool` stack is `true` and runs the optional `else` block if it is `false`.   If there are no `bool`s on the stack then the program will error. The stack type before the if statement can be `any` type but the type starting the if block and leaving the if is `bool`.
  
  ```python
  # `int` stack
  60 5 % 0 == 
  # `bool` stack
  if {
      # `bool` stack
      "60 is divisible by 5"
      # `str` stack
  } else {
      # `bool` stack
      "60 is not divisible by 5"
      # `str` stack
  }
  # `bool` stack
  str print drop
  # `str` stack
  ```

### Functions

Functions allow you to reuse code. Each function can only operate on certain types and can take the tops of stacks as input. TypeStack has many standard library functions that are available in any program. For example, the `-` function can subtract two integers or two floats.

#### Syntax

```rust
fn identifier(param: str) @str {
    # function contents
}
```

Functions start with the `fn` keyword followed by an identifier that is the name of the function. Parameters for the function are made by providing an identifier in the brackets and having an optional colon followed by a type. If no type is given for a parameter, it defaults to the type of the function. The type of the function is given by the `@type` value after the parameters. This type is the only type that the function can be called on. The type can be one of the 4 stack types or `any`, which allows it to be called on any stack.

#### Parameters

Function parameters can have any type. Parameters remove the top of their stack in the order that they come in the brackets. To use parameters, you just need to type the identifier in the function block.

```python
55 negate print # -55
"World!" "Hello, " combineStr print # Hello, World!

fn negate(num) @int {
  0 num # add 0 and the parameter to the stack
  - # call the `-` function on the `int` stack
}

fn combineStr(top second) @str {
    top + second
}
```

#### Other Important Function Information

* Functions are hoisted to the top of the program, meaning that you can call a function before the function is declared
* The block of a function always starts with a stack type of the function type
* Functions can have the same name as other functions with different function types. When calling one of these functions, only the function of the current stack type is run.
* Functions with the same name and same type as other defined functions overload the previous functions
* Functions cannot be declared within any block (`if` statements, `loop` etc.)

### Standard Library Functions

#### `@int`

* `<(right: int left: int)`: compares if the `left` value is less than the `right` value and adds `true` or `false` to the `bool`  stack
* `>(right: int left: int)`: compares if the `left` value is greater than the `right` value and adds `true` or `false` to the `bool`  stack
* `<=(right: int left: int)`: compares if the `left` value is less than or equal to the `right` value and adds `true` or `false` to the `bool`  stack
* `>=(right: int left: int)`: compares if the `left` value is greater than or equal to the `right` value and adds `true` or `false` to the `bool`  stack
* `+(right: int left: int)`: adds the sum of `left` and `right` to the `int` stack
* `-(right: int left: int)`: adds the difference between `left` and `right` to the `int` stack
* `*(right: int left: int)`: adds the product of `left` and `right` to the `int` stack
* `/(right: int left: int)`: adds the quotient of `left` and `right` to the `float` stack
* `//(right: int left: int)`: adds the floored quotient of `left` and `right` to the `int` stack (removes the decimal of the float)
* `%(right: int left: int)`: adds the remainder of the division of `left` and `right` to the `int` stack
* `^(right: int left: int)`: adds the power of `left` and `right` to the `int` stack 
* `rand(max: int min: int)`: adds a random number inclusively between `min` and `max` to the `int` stack 

#### `@float`

* `<(right: float left: float)`: compares if the `left` value is less than the `right` value and adds `true` or `false` to the `bool`  stack
* `>(right: float left: float)`: compares if the `left` value is greater than the `right` value and adds `true` or `false` to the `bool`  stack
* `<=(right: float left: float)`: compares if the `left` value is less than or equal to the `right` value and adds `true` or `false` to the `bool`  stack
* `>=(right: float left: float)`: compares if the `left` value is greater than or equal to the `right` value and adds `true` or `false` to the `bool`  stack
* `+(right: float left: float)`: adds the sum of `left` and `right` to the `float` stack
* `-(right: float left: float)`: adds the difference between `left` and `right` to the `float` stack
* `*(right: float left: float)`: adds the product of `left` and `right` to the `float` stack
* `/(right: float left: float)`: adds the quotient of `left` and `right` to the `float` stack
* `//(right: float left: float)`: adds the floored quotient of `left` and `right` to the `float` stack (removes the decimal of the float)
* `%(right: float left: float)`: adds the remainder of the division of `left` and `right` to the `float` stack
* `^(right: float left: float)`: adds the power of `left` and `right` to the `float` stack

#### `@str`

* `+(right: str left: str)`: combines `left` and `right` and adds it to the `str` stack
* `length(string: str)`: adds the length of `string` to the `int` stack

#### `@bool`

* `&(right: bool left: bool)`: adds `true` to the `bool` stack if both `right` and `left` are `true` or else, adds `false` to the `bool` stack
* `|(right: bool left: bool)`: adds `true` to the `bool` stack if one of `right` or `left` are `true` or else, adds `false` to the `bool` stack
* `!(boolean: bool)`: adds `true` to the `bool` if  `boolean` if `false` or else, add `false` to the `bool` stack

#### `@any`

* `dup(first: any)`: duplicates the top of the stack
* `drop(first: any)`: removes the top of the stack
* `swap(first: any second: any)`: swaps `first` and second `second` on the stack
* `rot(first: any second: any third: any)`: rotate `third` to the top of the stack
* `print(item: any)`: prints `item` to the console
* `==(right: any left: any)`: compares if the `left` value is equal to the `right` value and adds `true` or `false` to the `bool`  stack
* `!=(right: any left: any)`: compares if the `left` value is not equal to the `right` value and adds `true` or `false` to the `bool`  stack
* `toInt(item: any)`: converts `item` to an `int`. If `item` is a `float`, `item` is truncated. If `item` is an `str`, `item` is converted to an `int` or an error occurs. If `item` is a `bool`, `item` is `1` if `true` or `0` if `false`
* `toFloat(item: any)`: converts `item` to a `float`. If `item` is an `int`, `item` gains a `0` in the decimal place. If `item` is a `str`, `item` is converted to a `float` or an error occurs. If `item` is a `bool`, `item` is `1.0` if `true` or `0.0` if `false`
* `toStr(item: any)`: converts `item` to a `str` in the way you would type `item`
* `toBool(item: any)`: converts `item` to a `bool`. If `item` is an `int`, `item` is `true` if not `0`. If `item` is a `float`, `item` is `true` if not `0.0`. If `item` is a `str`, `item` is `true` if not empty (`""`)
