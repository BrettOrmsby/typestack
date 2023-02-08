# TypeStack

**A stack-based, type-safe language** 

> **Warning**
>  This is a work in progress language

[Documentation](https://brettormsby.github.io/typestack/#theBasics)

## Instillation for CLI

```bash
npm install typestack-lang -g
```

## Running Files via CLI

```bash
# tsk is the file extension for typestack
typestack filename.tsk
```

## VSCode 

Download the [extension](https://marketplace.visualstudio.com/items?itemName=BrettOrmsby.typestack) to provide language support to `.tsk` files.

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

## Example FizzBuzz Program

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

## Example Number Guess Program

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
