// Todo: running code, standard library, error function, comments

import interpret from "./interpret.js";
const input = `
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
`;

console.log(JSON.stringify(interpret(input), null, 2));