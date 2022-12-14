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

### Example Number Guess Program

```python
# make the random number
1 100 rand

# repeat while the guess is wrong
loop {
  "Guess a number: " int read
  over over # create a copy of the guess and random number
  == if {
    "You are correct!" print
    break
  } else {
    int over # create a copy of the random number on the top
    > if {
      "Too high!" print drop
    } else {
      "Too low!" print drop
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

### Modules

#### Importing Modules

```python
import Math
```

Importing modules must occur at the top of the program using the `import` keyword followed by the module name.

#### Running Module Functions

```python
import Math

55 Math.neg
```

Run module functions by prefixing the function with the module name followed by a period `.`. This syntax prevents the likelihood of overwriting other functions in the program.

### Standard Library Functions

#### `@int`

* `<(right: int left: int)`: compares if `left` is less than `right` and adds `true` or `false` to the `bool`  stack
* `>(right: int left: int)`: compares if `left` is greater than `right` and adds `true` or `false` to the `bool`  stack
* `<=(right: int left: int)`: compares if `left` is less than or equal to `right` and adds `true` or `false` to the `bool`  stack
* `>=(right: int left: int)`: compares if `left` is greater than or equal to `right` and adds `true` or `false` to the `bool`  stack
* `+(right: int left: int)`: adds the sum of `left` and `right` to the `int` stack
* `-(right: int left: int)`: adds the difference between `left` and `right` to the `int` stack
* `*(right: int left: int)`: adds the product of `left` and `right` to the `int` stack
* `/(right: int left: int)`: adds the quotient of `left` and `right` to the `float` stack
* `//(right: int left: int)`: adds the floored quotient of `left` and `right` to the `int` stack (removes the decimal of the float)
* `%(right: int left: int)`: adds the remainder of the division of `left` and `right` to the `int` stack
* `^(right: int left: int)`: adds the power of `left` and `right` to the `int` stack 
* `rand(max: int min: int)`: adds a random number inclusively between `min` and `max` to the `int` stack 

#### `@float`

* `<(right: float left: float)`: compares if `left` is less than `right` and adds `true` or `false` to the `bool`  stack
* `>(right: float left: float)`: compares if `left` is greater than `right` and adds `true` or `false` to the `bool`  stack
* `<=(right: float left: float)`: compares if `left` is less than or equal to `right` value and adds `true` or `false` to the `bool`  stack
* `>=(right: float left: float)`: compares if `left` is greater than or equal to `right` and adds `true` or `false` to the `bool`  stack
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
* `over(first: any second: any)`: duplicates `second` to the top of the stack
* `swap(first: any second: any)`: swaps `first` and second `second` on the stack
* `rot(first: any second: any third: any)`: rotate `third` to the top of the stack
* `print(item: any)`: prints `item` to the console
* `read(prompt: str)`: reads input from the console and adds it to the stack if it is valid in the type
* `==(right: any left: any)`: compares if `left` is equal to `right` and adds `true` or `false` to the `bool`  stack
* `!=(right: any left: any)`: compares if `left` is not equal to `right` and adds `true` or `false` to the `bool`  stack
* `toInt(item: any)`: converts `item` to an `int`. If `item` is a `float`, `item` is truncated. If `item` is an `str`, `item` is converted to an `int` or an error occurs. If `item` is a `bool`, `item` is `1` if `true` or `0` if `false`
* `toFloat(item: any)`: converts `item` to a `float`. If `item` is an `int`, `item` gains a `0` in the decimal place. If `item` is a `str`, `item` is converted to a `float` or an error occurs. If `item` is a `bool`, `item` is `1.0` if `true` or `0.0` if `false`
* `toStr(item: any)`: converts `item` to a `str` in the way you would type `item`
* `toBool(item: any)`: converts `item` to a `bool`. If `item` is an `int`, `item` is `true` if not `0`. If `item` is a `float`, `item` is `true` if not `0.0`. If `item` is a `str`, `item` is `true` if not empty (`""`)


### Module Functions

#### Math

##### `@int`

* `abs(num: int)`: adds the absolute (positive) value of `num` to the `int` stack 
* `neg(num: int)`: adds the negative value of `num` to the `int` stack 

##### `@float`

* `abs(num: float)`: adds the absolute (positive) value of `num` to the `float` stack 
* `neg(num: float)`: adds the negative value of `num` to the `float` stack 
* `ceil(num: float)`: adds the value of `num` rounded up to the nearest integer to the `int` stack 
* `floor(num: float)`: adds the value of `num` rounded down to the nearest integer to the `int` stack 
* `round(num: float)`: adds the rounded value of `num` to the `int` stack

#### Date

##### `@int`

* `now()`: adds the current date in milliseconds to the `int` stack 
* `getTimezoneOffset(date: int)`: adds the timezone offset of `date` to the `int` stack
* `getMilliseconds(date: int)`: add the millisecond (`0`-`999`) of `date` in local time to the `int` stack
* `getSeconds(date: int)`: adds the second (`0`-`59`) of `date` in local time to the `int` stack
* `getMinutes(date: int)`: adds the minute (`0`-`59`) of `date` in local time to the `int` stack
* `getHours(date: int)`: adds the hour (`0`-`23`) of `date` in local time to the `int` stack
* `getDay(date: int)`: adds the day (`0`-`6`) of `date` in local time to the `int` stack
* `getDate(date: int)`: adds the date (`1`-`31`) of `date` in local time to the `int` stack
* `getMonth(date: int)`: adds the month (`0`-`11`) of `date` in local time to the `int` stack
* `getYear(date: int)`: adds the year (`2006`) of `date` in local time to the `int` stack
* `getUTCMilliseconds(date: int)`: adds the millisecond (`0`-`999`) of `date` in universal time to the `int` stack
* `getUTCSeconds(date: int)`: adds the second (`0`-`59`) of `date` in universal time to the `int` stack
* `getUTCMinutes(date: int)`: adds the minute (`0`-`59`) of `date` in universal time to the `int` stack
* `getUTCHours(date: int)`: adds the hour (`0`-`23`) of `date` in universal time to the `int` stack
* `getUTCDay(date: int)`: adds the day (`0`-`6`) of `date` in universal time to the `int` stack
* `getUTCDate(date: int)`: adds the date (`1`-`31`) of `date` in universal time to the `int` stack
* `getUTCMonth(date: int)`: adds the month (`0`-`11`) of `date` in universal time to the `int` stack
* `getUTCYear(date: int)`: adds the year (`2006`) of `date` in universal time to the `int` stack
* `setMilliseconds(millisecond: int date: int)`: sets the milliseconds of `date` in local time to `milliseconds` and adds it to the `int` stack
* `setSeconds(second: int date: int)`: sets the seconds of `date` in local time to `second` and adds it to the `int` stack
* `setMinutes(minute: int date: int)`: sets the minutes of `date` in local time to `minute` and adds it to the `int` stack
* `setHours(hour: int date: int)`: sets the hours of `date` in local time to `hour` and adds it to the `int` stack
* `setDay(day: int date: int)`: sets the day of `date` in local time to `day` and adds it to the `int` stack
* `setDate(day: int date: int)`: sets the date of `date` in local time to `day` and adds it to the `int` stack
* `setMonth(month: int date: int)`: sets the month of `date` in local time to `month` and adds it to the `int` stack
* `setYear(millisecond: int date: int)`: sets the year of `date` in local time to `year` and adds it to the `int` stack
* `setUTCMilliseconds(millisecond: int date: int)`: sets the milliseconds of `date` in universal time to `milliseconds` and adds it to the `int` stack
* `setUTCSeconds(second: int date: int)`: sets the seconds of `date` in universal time to `second` and adds it to the `int` stack
* `setUTCMinutes(minute: int date: int)`: sets the minutes of `date` in universal time to `minute` and adds it to the `int` stack
* `setUTCHours(hour: int date: int)`: sets the hours of `date` in universal time to `hour` and adds it to the `int` stack
* `setUTCDay(day: int date: int)`: sets the day of `date` in universal time to `day` and adds it to the `int` stack
* `setUTCDate(day: int date: int)`: sets the date of `date` in universal time to `day` and adds it to the `int` stack
* `setUTCMonth(month: int date: int)`: sets the month of `date` in universal time to `month` and adds it to the `int` stack
* `setUTCYear(millisecond: int date: int)`: sets the year of `date` in universal time to `year` and adds it to the `int` stack
* `toStr(date: int)`: converts the date to a `str` (`"Tue Aug 19 1975 23:15:30 GMT+0200 (CEST)"`) and adds it to the `str` stack
* `toDateStr(date: int)`: converts the date to a date`str` (`"Wed Jul 28 1993"`) and adds it to the `str` stack
* `toISOStr(date: int)`: converts the date to a ISO `str` (`"2011-10-05T14:48:00.000Z"`) and adds it to the `str` stack
* `toUTCStr(date: int)`: converts the date to a UTC `str` (`"Wed, 14 Jun 2017 07:00:00 GMT"`) and adds it to the `str` stack
* `toTimeStr(date: int)`: converts the date to a time `str` (`"23:15:30 GMT+0200 (CEST)"`) and adds it to the `str` stack

##### `@str`

* `parse(date: str)`: adds the milliseconds of `date` (`"01 Jan 1970 00:00:00 GMT"`) to the `int` stack 

#### Str

##### `@int`

* `fromCharCode(code: int)`: adds the character for the UTF-16 code of `code` to the `str` stack
* `fromCodePoint(code: int)`: adds the character for the code point `code` to the `str` stack
* `repeat(string: str amount: int)`: repeats `string` `amount` times and adds the it to the `str` stack. `amount` must be greater than or equal to `0`
* `charAt(string: str index: int)`: adds the character at index (starting at 0) `index` of `string` to the `str` stack. If there is no character at the index, it adds `""` to the `str` stack
* `charCodeAt(string: str index: int)`: adds the character code at index (starting at 0) `index` of `string` to the `int` stack. If there is no character at the index, an error occurs
* `codePointAt(string: str index: int)`: adds the code point of the character at index (starting at 0) `index` of `string` to the `int` stack. If there is no character at the index, an error occurs
* `slice(string: str endIndex: int startIndex: int)`: adds the the str made by extracting the characters from `startIndex` (starting at 0) up to but not including `endIndex` of `string` to the `str` stack. 

##### `@str`

* `startsWith(start: str string: str)`: checks if `string` starts with `start` and adds `true` or `false` to the `bool` stack
* `endsWith(end: str string: str)`: checks if `string` ends with `end` and adds `true` or `false` to the `bool` stack
* `includes(search: str string: str)`: checks if `string` contains `search` and adds `true` or `false` to the `bool` stack
* `toUpper(string: str)`: converts `string` to all upper cases and adds it to the `str` stack 
* `toLower(string: str)`: converts `string` to all lower cases and adds it to the `str` stack 
* `trim(string: str)`: removes whitespace  from the start and end of `string` and adds it to the `str` stack
* `reverse(string: str)`: reverses the characters of `string` and adds it to the `str` stack 
* `occurrence(search: str string: str)`: adds the number of occurrences of `search` in `string` to the `int` stack 
* `replace(replacement: str search: str string: str)`: replaces the first occurrence of `search` with `replacement` in `string` and adds it to the `str` stack
* `replaceAll(replacement: str search: str string: str)`: replaces all occurrences of `search` with `replacement` in `string` and adds it to the `str` stack
* `repeat(string: str amount: int)`: repeats `string` `amount` times and adds the it to the `str` stack. `amount` must be greater than or equal to `0`
* `indexOf(search: str string: str)`: adds the index of the first occurrence of `search` in `string` to the `int` stack. If `search` is not in `string`, it adds `-1` to the `int`stack
* `lastIndexOf(search: str string: str)`: adds the index of the last occurrence of `search` in `string` to the `int` stack. If `search` is not in `string`, it adds `-1` to the `int`stack
* `charAt(string: str index: int)`: adds the character at index (starting at 0) `index` of `string` to the `str` stack. If there is no character at the index, it adds `""` to the `str` stack
* `charCodeAt(string: str index: int)`: adds the character code at index (starting at 0) `index` of `string` to the `int` stack. If there is no character at the index, an error occurs
* `codePointAt(string: str index: int)`: adds the code point of the character at index (starting at 0) `index` of `string` to the `int` stack. If there is no character at the index, an error occurs
* `slice(string: str endIndex: int startIndex: int)`: adds the the str made by extracting the characters from `startIndex` (starting at 0) up to but not including `endIndex` of `string` to the `str` stack. 
* `split(separator: str string: str)`: splits `string` by `separator` and adds each item to the `str` stack such that the last item is on the top of the stack