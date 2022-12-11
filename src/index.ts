import Scanner from "./scan.js";
const s = new Scanner(`
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
console.log(s.scan());