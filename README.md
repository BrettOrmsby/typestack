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
import typestack from "typestack-lang";

typestack(`
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