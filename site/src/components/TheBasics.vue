<script lang="ts">
export default {
  name: "TheBasics",
};
</script>

<template>
  <section id="theBasics">
    <h2>The Basics</h2>
    <TypeStackEditor :code="`&quot;Hello, World!&quot; print`" />
    <p>
      Type stack is a stack-based concatenated language. This introduction
      assumes you know the basics of at least one programming language and have
      an understanding of how stacks work.
    </p>

    <h3>TypeStack Stacks</h3>
    <p>
      TypeStack has 4 stacks, 1 stack for each type: <code>int</code>,
      <code>float</code>, <code>str</code> and <code>bool</code>. Whenever you
      use a type value, the stack type changes. The stack type can also change
      when you use a type keyword: <code>int</code>, <code>float</code>,
      <code>str</code> or <code>bool</code> and enter or exit loops and if
      statements.
    </p>
    <p>
      The stack type is important as you can only call functions on certain
      types and functions are called on the stack type.
    </p>

    <h3>Example FizzBuzz Program</h3>
    <TypeStackEditor
      :code="`100 for loop {
    dup 15 % 0 ==
    if {
        &quot;FizzBuzz&quot; print drop
    } else {
        int dup 5 % 0 ==
        if {
            &quot;Buzz&quot; print drop
        } else {
            int dup 3 % 0 ==
            if {
                &quot;Fizz&quot; print drop
            } else {
                int print
            }
        }
    }
}`"
    />

    <h3>Example Number Guess Program</h3>
    <TypeStackEditor
      :code="`# make the random number
1 100 rand

# repeat while the guess is wrong
loop {
  &quot;Guess a number: &quot; int read
  over over # create a copy of the guess and random number
  == if {
    &quot;You are correct!&quot; print
    break
  } else {
    int over # create a copy of the random number on the top
    > if {
      &quot;Too high!&quot; print drop
    } else {
      &quot;Too low!&quot; print drop
    }
  }
}`"
    />

    <h3>Expressions</h3>
    <ul>
      <li>
        <strong>Type keywords</strong>: keywords that are a type:
        <code>int</code>, <code>float</code>, <code>str</code>,
        <code>bool</code> or <code>any</code> change the stack type.
      </li>
      <li>
        <strong><code>break</code></strong
        >: exits a loop.
      </li>
      <li>
        <strong><code>continue</code></strong
        >: stops the current cycle of a loop and continues to the next cycle.
      </li>
      <li>
        <strong>Ints</strong>: Any number without a decimal place is an
        <code>int</code> (integer) and is added to the <code>int</code> stack.
        The stack type is also changed to the <code>int</code> stack.
        <TypeStackEditor
          :code="`# valid \`int\`s
55 0 123456789
# invalid \`int\`s
-55 55.66`"
        />
      </li>
      <li>
        <strong>Floats</strong>: Any number with a decimal place is a
        <code>float</code> and is added to the <code>float</code> stack. The
        stack type is also changed to the <code>float</code> stack.
        <TypeStackEditor
          :code="`# valid \`floats\`s
5.44 0.0 123456789.987654321
# invalid \`floats\`s
-55.0 .5566 66`"
        />
      </li>
      <li>
        <strong>Strs</strong>: A <code>str</code> is a string of characters
        denoted by the double quotes <code>"</code> and is added to the
        <code>str</code> stack. The stack type is also changed to the
        <code>str</code> stack. <code>str</code>s can also have escape
        characters including <code>\n</code> for newlines, <code>\t</code> for
        tabs, <code>\r</code> for cartridge returns, <code>\\</code> for
        backslashes and <code>\"</code> for double quotes.
        <TypeStackEditor
          :code="`# valid \`str\`s
&quot;Hello, World!&quot;
&quot;Multi
line
string
&quot;
&quot;string with escape \n codes \\\&quot;&quot;
# invalid \`str\`s
&quot;string with invalid escape code \\f&quot;
&quot;string without ending double quote`"
        />
      </li>
      <li>
        <strong>Bools</strong>: <code>true</code> and <code>false</code> are
        <code>bool</code>s (Booleans) and are added to the
        <code>bool</code> stack. The stack type is also changed to the
        <code>bool</code> stack.
        <TypeStackEditor
          :code="`# valid \`bool\`s
true false
# invalid \`bool\`s
True False`"
        />
      </li>
      <li>
        <strong>Identifiers</strong>: Identifiers are most other values that do
        not start with a number, double quote, bracket or parenthesis and are
        not keywords. Identifiers are normally calls to functions but can also
        be function parameters.
        <TypeStackEditor
          :code="`# valid identifiers
value - item2
# invalid identifiers
true 33k f()`"
        />
      </li>
    </ul>

    <h3>Statements</h3>
    <ul>
      <li>
        <strong><code>loop</code></strong
        >: A loop statement repeats its block until it is exited using a
        <code>break</code> expression. The stack type before the loop is the
        same as the stack type starting the loop block and the same after the
        loop.
        <TypeStackEditor
          :code="`# Programs start in the \`int\` stack
  66
  loop {
      # \`int\` stack
      1 +
      print
      dup 5 % 0 ==
      if {
          break
      }
  }
  # \`int\` stack`"
        />
      </li>
      <li>
        <strong><code>while loop</code></strong
        >: A while loop statement repeats its block until the top of the
        <code>bool</code> stack is <code>false</code>. The loop consumes the top
        of the stack each time, meaning that the condition will have to be
        re-added after each repetition. If there are no <code>bool</code>s on
        the stack then the program will error. The stack type before the loop
        can be <code>any</code> type but the type starting the loop block and
        leaving the loop is <code>bool</code>.
        <TypeStackEditor
          :code="`# \`int\` stack
true
# \`bool\` stack
66
# \`int\` stack
while loop {
    # \`bool\` stack
    1 +
    # \`int\` stack
    print
    dup 5 % 0 !=
}`"
        />
      </li>
      <li>
        <strong><code>for loop</code></strong
        >: A for loop statement repeats its block until the top of the
        <code>int</code> stack is <code>0</code>. At the end of each cycle, the
        top of the <code>int</code> stack is incremented or decremented by
        <code>1</code> so it is closer to <code>0</code>. If there are no
        <code>int</code>s on the stack then the program will error. The stack
        type before the loop can be <code>any</code> type but the type starting
        the loop block and leaving the loop is <code>int</code>.
        <TypeStackEditor
          :code="`# \`int\` stack
100
&quot;Are we there yet?&quot;
# \`str\` stack
for loop {
    # \`int\` stack
    str print
}`"
        />
      </li>
      <li>
        <strong><code>if else</code></strong
        >: An if statement runs its block if the top of the
        <code>bool</code> stack is <code>true</code> and runs the optional
        <code>else</code> block if it is <code>false</code>. If there are no
        <code>bool</code>s on the stack then the program will error. The stack
        type before the if statement can be <code>any</code> type but the type
        starting the if block and leaving the if is <code>bool</code>.
        <TypeStackEditor
          :code="`# \`int\` stack
60 5 % 0 == 
# \`bool\` stack
if {
    # \`bool\` stack
    &quot;60 is divisible by 5&quot;
    # \`str\` stack
} else {
    # \`bool\` stack
    &quot;60 is not divisible by 5&quot;
    # \`str\` stack
}
# \`bool\` stack
str print drop
# \`str\` stack`"
        />
      </li>
    </ul>

    <h3>Functions</h3>
    <p>
      Functions allow you to reuse code. Each function can only operate on
      certain types and can take the tops of stacks as input. TypeStack has many
      standard library functions that are available in any program. For example,
      the <code>-</code> function can subtract two integers or two floats.
    </p>

    <h4>Syntax</h4>
    <TypeStackEditor
      :code="`fn identifier(param: str) @str {
    # function contents
}`"
    />
    <p>
      Functions start with the <code>fn</code> keyword followed by an identifier
      that is the name of the function. Parameters for the function are made by
      providing an identifier in the brackets and having an optional colon
      followed by a type. If no type is given for a parameter, it defaults to
      the type of the function. The type of the function is given by the
      <code>@type</code> value after the parameters. This type is the only type
      that the function can be called on. The type can be one of the 4 stack
      types or <code>any</code>, which allows it to be called on any stack.
    </p>

    <h4>Parameters</h4>
    <p>
      Function parameters can have any type. Parameters remove the top of their
      stack in the order that they come in the brackets. To use parameters, you
      just need to type the identifier in the function block.
    </p>
    <TypeStackEditor
      :code="`55 negate print # -55
&quot;World!&quot; &quot;Hello, &quot; combineStr print # Hello, World!

fn negate(num) @int {
  0 num # add 0 and the parameter to the stack
  - # call the \`-\` function on the \`int\` stack
}

fn combineStr(top second) @str {
    top + second
}`"
    />

    <h4>Other Important Function Information</h4>
    <ul>
      <li>
        Functions are hoisted to the top of the program, meaning that you can
        call a function before the function is declared
      </li>
      <li>
        The block of a function always starts with a stack type of the function
        type
      </li>
      <li>
        Functions can have the same name as other functions with different
        function types. When calling one of these functions, only the function
        of the current stack type is run.
      </li>
      <li>
        Functions with the same name and same type as other defined functions
        overload the previous functions
      </li>
      <li>
        Functions cannot be declared within any block (<code>if</code>
        statements, <code>loop</code> etc.)
      </li>
    </ul>

    <h3>Modules</h3>

    <h4>Importing Modules</h4>
    <TypeStackEditor :code="`import Math`" />
    <p>
      Importing modules must occur at the top of the program using the
      <code>import</code> keyword followed by the module name. Note: importing
      modules modules on the browser will cause an error. Modules come
      pre-imported.
    </p>

    <h4>Running Module Functions</h4>
    <TypeStackEditor
      :code="`import Math

55 Math.neg`"
    />
    <p>
      Run module functions by prefixing the function with the module name
      followed by a period <code>.</code>. This syntax prevents the likelihood
      of overwriting other functions in the program.
    </p>

    <h3>Standard Library Functions</h3>
    <h4><code>@int</code></h4>
    <ul>
      <li>
        <code>&lt;(right: int left: int)</code>: compares if
        <code>left</code> is less than <code>right</code> and adds
        <code>true</code> or <code>false</code> to the <code>bool</code> stack
      </li>
      <li>
        <code>&gt;(right: int left: int)</code>: compares if
        <code>left</code> is greater than <code>right</code> and adds
        <code>true</code> or <code>false</code> to the <code>bool</code> stack
      </li>
      <li>
        <code>&lt;=(right: int left: int)</code>: compares if
        <code>left</code> is less than or equal to <code>right</code> and adds
        <code>true</code> or <code>false</code> to the <code>bool</code> stack
      </li>
      <li>
        <code>&gt;=(right: int left: int)</code>: compares if
        <code>left</code> is greater than or equal to <code>right</code> and
        adds <code>true</code> or <code>false</code> to the
        <code>bool</code> stack
      </li>
      <li>
        <code>+(right: int left: int)</code>: adds the sum of
        <code>left</code> and <code>right</code> to the <code>int</code> stack
      </li>
      <li>
        <code>-(right: int left: int)</code>: adds the difference between
        <code>left</code> and <code>right</code> to the <code>int</code> stack
      </li>
      <li>
        <code>*(right: int left: int)</code>: adds the product of
        <code>left</code> and <code>right</code> to the <code>int</code> stack
      </li>
      <li>
        <code>/(right: int left: int)</code>: adds the quotient of
        <code>left</code> and <code>right</code> to the <code>float</code> stack
      </li>
      <li>
        <code>//(right: int left: int)</code>: adds the floored quotient of
        <code>left</code> and <code>right</code> to the <code>int</code> stack
        (removes the decimal of the float)
      </li>
      <li>
        <code>%(right: int left: int)</code>: adds the remainder of the division
        of <code>left</code> and <code>right</code> to the
        <code>int</code> stack
      </li>
      <li>
        <code>^(right: int left: int)</code>: adds the power of
        <code>left</code> and <code>right</code> to the <code>int</code> stack
      </li>
      <li>
        <code>rand(max: int min: int)</code>: adds a random number inclusively
        between <code>min</code> and <code>max</code> to the
        <code>int</code> stack
      </li>
    </ul>
    <h4><code>@float</code></h4>
    <ul>
      <li>
        <code>&lt;(right: float left: float)</code>: compares if
        <code>left</code> is less than <code>right</code> and adds
        <code>true</code> or <code>false</code> to the <code>bool</code> stack
      </li>
      <li>
        <code>&gt;(right: float left: float)</code>: compares if
        <code>left</code> is greater than <code>right</code> and adds
        <code>true</code> or <code>false</code> to the <code>bool</code> stack
      </li>
      <li>
        <code>&lt;=(right: float left: float)</code>: compares if
        <code>left</code> is less than or equal to <code>right</code> value and
        adds <code>true</code> or <code>false</code> to the
        <code>bool</code> stack
      </li>
      <li>
        <code>&gt;=(right: float left: float)</code>: compares if
        <code>left</code> is greater than or equal to <code>right</code> and
        adds <code>true</code> or <code>false</code> to the
        <code>bool</code> stack
      </li>
      <li>
        <code>+(right: float left: float)</code>: adds the sum of
        <code>left</code> and <code>right</code> to the <code>float</code> stack
      </li>
      <li>
        <code>-(right: float left: float)</code>: adds the difference between
        <code>left</code> and <code>right</code> to the <code>float</code> stack
      </li>
      <li>
        <code>*(right: float left: float)</code>: adds the product of
        <code>left</code> and <code>right</code> to the <code>float</code> stack
      </li>
      <li>
        <code>/(right: float left: float)</code>: adds the quotient of
        <code>left</code> and <code>right</code> to the <code>float</code> stack
      </li>
      <li>
        <code>//(right: float left: float)</code>: adds the floored quotient of
        <code>left</code> and <code>right</code> to the <code>float</code> stack
        (removes the decimal of the float)
      </li>
      <li>
        <code>%(right: float left: float)</code>: adds the remainder of the
        division of <code>left</code> and <code>right</code> to the
        <code>float</code> stack
      </li>
      <li>
        <code>^(right: float left: float)</code>: adds the power of
        <code>left</code> and <code>right</code> to the <code>float</code> stack
      </li>
    </ul>
    <h4><code>@str</code></h4>
    <ul>
      <li>
        <code>+(right: str left: str)</code>: combines <code>left</code> and
        <code>right</code> and adds it to the <code>str</code> stack
      </li>
      <li>
        <code>length(string: str)</code>: adds the length of
        <code>string</code> to the <code>int</code> stack
      </li>
    </ul>
    <h4><code>@bool</code></h4>
    <ul>
      <li>
        <code>&amp;(right: bool left: bool)</code>: adds <code>true</code> to
        the <code>bool</code> stack if both <code>right</code> and
        <code>left</code> are <code>true</code> or else, adds
        <code>false</code> to the <code>bool</code> stack
      </li>
      <li>
        <code>|(right: bool left: bool)</code>: adds <code>true</code> to the
        <code>bool</code> stack if one of <code>right</code> or
        <code>left</code> are <code>true</code> or else, adds
        <code>false</code> to the <code>bool</code> stack
      </li>
      <li>
        <code>!(boolean: bool)</code>: adds <code>true</code> to the
        <code>bool</code> if <code>boolean</code> if <code>false</code> or else,
        add <code>false</code> to the <code>bool</code> stack
      </li>
    </ul>
    <h4><code>@any</code></h4>
    <ul>
      <li><code>dup(first: any)</code>: duplicates the top of the stack</li>
      <li><code>drop(first: any)</code>: removes the top of the stack</li>
      <li>
        <code>over(first: any second: any)</code>: duplicates
        <code>second</code> to the top of the stack
      </li>
      <li>
        <code>swap(first: any second: any)</code>: swaps <code>first</code> and
        second <code>second</code> on the stack
      </li>
      <li>
        <code>rot(first: any second: any third: any)</code>: rotate
        <code>third</code> to the top of the stack
      </li>
      <li>
        <code>print(item: any)</code>: prints <code>item</code> to the console
      </li>
      <li>
        <code>read(prompt: str)</code>: reads input from the console and adds it
        to the stack if it is valid in the type
      </li>
      <li>
        <code>==(right: any left: any)</code>: compares if <code>left</code> is
        equal to <code>right</code> and adds <code>true</code> or
        <code>false</code> to the <code>bool</code> stack
      </li>
      <li>
        <code>!=(right: any left: any)</code>: compares if <code>left</code> is
        not equal to <code>right</code> and adds <code>true</code> or
        <code>false</code> to the <code>bool</code> stack
      </li>
      <li>
        <code>toInt(item: any)</code>: converts <code>item</code> to an
        <code>int</code>. If <code>item</code> is a <code>float</code>,
        <code>item</code> is truncated. If <code>item</code> is an
        <code>str</code>, <code>item</code> is converted to an
        <code>int</code> or an error occurs. If <code>item</code> is a
        <code>bool</code>, <code>item</code> is <code>1</code> if
        <code>true</code> or <code>0</code> if <code>false</code>
      </li>
      <li>
        <code>toFloat(item: any)</code>: converts <code>item</code> to a
        <code>float</code>. If <code>item</code> is an <code>int</code>,
        <code>item</code> gains a <code>0</code> in the decimal place. If
        <code>item</code> is a <code>str</code>, <code>item</code> is converted
        to a <code>float</code> or an error occurs. If <code>item</code> is a
        <code>bool</code>, <code>item</code> is <code>1.0</code> if
        <code>true</code> or <code>0.0</code> if <code>false</code>
      </li>
      <li>
        <code>toStr(item: any)</code>: converts <code>item</code> to a
        <code>str</code> in the way you would type <code>item</code>
      </li>
      <li>
        <code>toBool(item: any)</code>: converts <code>item</code> to a
        <code>bool</code>. If <code>item</code> is an <code>int</code>,
        <code>item</code> is <code>true</code> if not <code>0</code>. If
        <code>item</code> is a <code>float</code>, <code>item</code> is
        <code>true</code> if not <code>0.0</code>. If <code>item</code> is a
        <code>str</code>, <code>item</code> is <code>true</code> if not empty
        (<code>""</code>)
      </li>
    </ul>
    <h3>Module Functions</h3>
    <h4>Math</h4>
    <h5><code>@int</code></h5>
    <ul>
      <li>
        <code>abs(num: int)</code>: adds the absolute (positive) value of
        <code>num</code> to the <code>int</code> stack
      </li>
      <li>
        <code>neg(num: int)</code>: adds the negative value of
        <code>num</code> to the <code>int</code> stack
      </li>
    </ul>
    <h5><code>@float</code></h5>
    <ul>
      <li>
        <code>abs(num: float)</code>: adds the absolute (positive) value of
        <code>num</code> to the <code>float</code> stack
      </li>
      <li>
        <code>neg(num: float)</code>: adds the negative value of
        <code>num</code> to the <code>float</code> stack
      </li>
      <li>
        <code>ceil(num: float)</code>: adds the value of
        <code>num</code> rounded up to the nearest integer to the
        <code>int</code> stack
      </li>
      <li>
        <code>floor(num: float)</code>: adds the value of
        <code>num</code> rounded down to the nearest integer to the
        <code>int</code> stack
      </li>
      <li>
        <code>round(num: float)</code>: adds the rounded value of
        <code>num</code> to the <code>int</code> stack
      </li>
    </ul>
    <h4>Date</h4>
    <h5><code>@int</code></h5>
    <ul>
      <li>
        <code>now()</code>: adds the current date in milliseconds to the
        <code>int</code> stack
      </li>
      <li>
        <code>getTimezoneOffset(date: int)</code>: adds the timezone offset of
        <code>date</code> to the <code>int</code> stack
      </li>
      <li>
        <code>getMilliseconds(date: int)</code>: add the millisecond
        (<code>0</code>-<code>999</code>) of <code>date</code> in local time to
        the <code>int</code> stack
      </li>
      <li>
        <code>getSeconds(date: int)</code>: adds the second
        (<code>0</code>-<code>59</code>) of <code>date</code> in local time to
        the <code>int</code> stack
      </li>
      <li>
        <code>getMinutes(date: int)</code>: adds the minute
        (<code>0</code>-<code>59</code>) of <code>date</code> in local time to
        the <code>int</code> stack
      </li>
      <li>
        <code>getHours(date: int)</code>: adds the hour
        (<code>0</code>-<code>23</code>) of <code>date</code> in local time to
        the <code>int</code> stack
      </li>
      <li>
        <code>getDay(date: int)</code>: adds the day
        (<code>0</code>-<code>6</code>) of <code>date</code> in local time to
        the <code>int</code> stack
      </li>
      <li>
        <code>getDate(date: int)</code>: adds the date
        (<code>1</code>-<code>31</code>) of <code>date</code> in local time to
        the <code>int</code> stack
      </li>
      <li>
        <code>getMonth(date: int)</code>: adds the month
        (<code>0</code>-<code>11</code>) of <code>date</code> in local time to
        the <code>int</code> stack
      </li>
      <li>
        <code>getYear(date: int)</code>: adds the year (<code>2006</code>) of
        <code>date</code> in local time to the <code>int</code> stack
      </li>
      <li>
        <code>getUTCMilliseconds(date: int)</code>: adds the millisecond
        (<code>0</code>-<code>999</code>) of <code>date</code> in universal time
        to the <code>int</code> stack
      </li>
      <li>
        <code>getUTCSeconds(date: int)</code>: adds the second
        (<code>0</code>-<code>59</code>) of <code>date</code> in universal time
        to the <code>int</code> stack
      </li>
      <li>
        <code>getUTCMinutes(date: int)</code>: adds the minute
        (<code>0</code>-<code>59</code>) of <code>date</code> in universal time
        to the <code>int</code> stack
      </li>
      <li>
        <code>getUTCHours(date: int)</code>: adds the hour
        (<code>0</code>-<code>23</code>) of <code>date</code> in universal time
        to the <code>int</code> stack
      </li>
      <li>
        <code>getUTCDay(date: int)</code>: adds the day
        (<code>0</code>-<code>6</code>) of <code>date</code> in universal time
        to the <code>int</code> stack
      </li>
      <li>
        <code>getUTCDate(date: int)</code>: adds the date
        (<code>1</code>-<code>31</code>) of <code>date</code> in universal time
        to the <code>int</code> stack
      </li>
      <li>
        <code>getUTCMonth(date: int)</code>: adds the month
        (<code>0</code>-<code>11</code>) of <code>date</code> in universal time
        to the <code>int</code> stack
      </li>
      <li>
        <code>getUTCYear(date: int)</code>: adds the year (<code>2006</code>) of
        <code>date</code> in universal time to the <code>int</code> stack
      </li>
      <li>
        <code>setMilliseconds(millisecond: int date: int)</code>: sets the
        milliseconds of <code>date</code> in local time to
        <code>milliseconds</code> and adds it to the <code>int</code> stack
      </li>
      <li>
        <code>setSeconds(second: int date: int)</code>: sets the seconds of
        <code>date</code> in local time to <code>second</code> and adds it to
        the <code>int</code> stack
      </li>
      <li>
        <code>setMinutes(minute: int date: int)</code>: sets the minutes of
        <code>date</code> in local time to <code>minute</code> and adds it to
        the <code>int</code> stack
      </li>
      <li>
        <code>setHours(hour: int date: int)</code>: sets the hours of
        <code>date</code> in local time to <code>hour</code> and adds it to the
        <code>int</code> stack
      </li>
      <li>
        <code>setDay(day: int date: int)</code>: sets the day of
        <code>date</code> in local time to <code>day</code> and adds it to the
        <code>int</code> stack
      </li>
      <li>
        <code>setDate(day: int date: int)</code>: sets the date of
        <code>date</code> in local time to <code>day</code> and adds it to the
        <code>int</code> stack
      </li>
      <li>
        <code>setMonth(month: int date: int)</code>: sets the month of
        <code>date</code> in local time to <code>month</code> and adds it to the
        <code>int</code> stack
      </li>
      <li>
        <code>setYear(millisecond: int date: int)</code>: sets the year of
        <code>date</code> in local time to <code>year</code> and adds it to the
        <code>int</code> stack
      </li>
      <li>
        <code>setUTCMilliseconds(millisecond: int date: int)</code>: sets the
        milliseconds of <code>date</code> in universal time to
        <code>milliseconds</code> and adds it to the <code>int</code> stack
      </li>
      <li>
        <code>setUTCSeconds(second: int date: int)</code>: sets the seconds of
        <code>date</code> in universal time to <code>second</code> and adds it
        to the <code>int</code> stack
      </li>
      <li>
        <code>setUTCMinutes(minute: int date: int)</code>: sets the minutes of
        <code>date</code> in universal time to <code>minute</code> and adds it
        to the <code>int</code> stack
      </li>
      <li>
        <code>setUTCHours(hour: int date: int)</code>: sets the hours of
        <code>date</code> in universal time to <code>hour</code> and adds it to
        the <code>int</code> stack
      </li>
      <li>
        <code>setUTCDay(day: int date: int)</code>: sets the day of
        <code>date</code> in universal time to <code>day</code> and adds it to
        the <code>int</code> stack
      </li>
      <li>
        <code>setUTCDate(day: int date: int)</code>: sets the date of
        <code>date</code> in universal time to <code>day</code> and adds it to
        the <code>int</code> stack
      </li>
      <li>
        <code>setUTCMonth(month: int date: int)</code>: sets the month of
        <code>date</code> in universal time to <code>month</code> and adds it to
        the <code>int</code> stack
      </li>
      <li>
        <code>setUTCYear(millisecond: int date: int)</code>: sets the year of
        <code>date</code> in universal time to <code>year</code> and adds it to
        the <code>int</code> stack
      </li>
      <li>
        <code>toStr(date: int)</code>: converts the date to a
        <code>str</code> (<code>"Tue Aug 19 1975 23:15:30 GMT+0200 (CEST)"</code
        >) and adds it to the <code>str</code> stack
      </li>
      <li>
        <code>toDateStr(date: int)</code>: converts the date to a date<code
          >str</code
        >
        (<code>"Wed Jul 28 1993"</code>) and adds it to the
        <code>str</code> stack
      </li>
      <li>
        <code>toISOStr(date: int)</code>: converts the date to a ISO
        <code>str</code> (<code>"2011-10-05T14:48:00.000Z"</code>) and adds it
        to the <code>str</code> stack
      </li>
      <li>
        <code>toUTCStr(date: int)</code>: converts the date to a UTC
        <code>str</code> (<code>"Wed, 14 Jun 2017 07:00:00 GMT"</code>) and adds
        it to the <code>str</code> stack
      </li>
      <li>
        <code>toTimeStr(date: int)</code>: converts the date to a time
        <code>str</code> (<code>"23:15:30 GMT+0200 (CEST)"</code>) and adds it
        to the <code>str</code> stack
      </li>
    </ul>
    <h5><code>@str</code></h5>
    <ul>
      <li>
        <code>parse(date: str)</code>: adds the milliseconds of
        <code>date</code> (<code>"01 Jan 1970 00:00:00 GMT"</code>) to the
        <code>int</code> stack
      </li>
    </ul>
    <h4>Str</h4>
    <h5><code>@int</code></h5>
    <ul>
      <li>
        <code>fromCharCode(code: int)</code>: adds the character for the UTF-16
        code of <code>code</code> to the <code>str</code> stack
      </li>
      <li>
        <code>fromCodePoint(code: int)</code>: adds the character for the code
        point <code>code</code> to the <code>str</code> stack
      </li>
      <li>
        <code>repeat(string: str amount: int)</code>: repeats
        <code>string</code> <code>amount</code> times and adds the it to the
        <code>str</code> stack. <code>amount</code> must be greater than or
        equal to <code>0</code>
      </li>
      <li>
        <code>charAt(string: str index: int)</code>: adds the character at index
        (starting at 0) <code>index</code> of <code>string</code> to the
        <code>str</code> stack. If there is no character at the index, it adds
        <code>""</code> to the <code>str</code> stack
      </li>
      <li>
        <code>charCodeAt(string: str index: int)</code>: adds the character code
        at index (starting at 0) <code>index</code> of <code>string</code> to
        the <code>int</code> stack. If there is no character at the index, an
        error occurs
      </li>
      <li>
        <code>codePointAt(string: str index: int)</code>: adds the code point of
        the character at index (starting at 0) <code>index</code> of
        <code>string</code> to the <code>int</code> stack. If there is no
        character at the index, an error occurs
      </li>
      <li>
        <code>slice(string: str endIndex: int startIndex: int)</code>: adds the
        the str made by extracting the characters from
        <code>startIndex</code> (starting at 0) up to but not including
        <code>endIndex</code> of <code>string</code> to the
        <code>str</code> stack.
      </li>
    </ul>
    <h5><code>@str</code></h5>
    <ul>
      <li>
        <code>startsWith(start: str string: str)</code>: checks if
        <code>string</code> starts with <code>start</code> and adds
        <code>true</code> or <code>false</code> to the <code>bool</code> stack
      </li>
      <li>
        <code>endsWith(end: str string: str)</code>: checks if
        <code>string</code> ends with <code>end</code> and adds
        <code>true</code> or <code>false</code> to the <code>bool</code> stack
      </li>
      <li>
        <code>includes(search: str string: str)</code>: checks if
        <code>string</code> contains <code>search</code> and adds
        <code>true</code> or <code>false</code> to the <code>bool</code> stack
      </li>
      <li>
        <code>toUpper(string: str)</code>: converts <code>string</code> to all
        upper cases and adds it to the <code>str</code> stack
      </li>
      <li>
        <code>toLower(string: str)</code>: converts <code>string</code> to all
        lower cases and adds it to the <code>str</code> stack
      </li>
      <li>
        <code>trim(string: str)</code>: removes whitespace from the start and
        end of <code>string</code> and adds it to the <code>str</code> stack
      </li>
      <li>
        <code>reverse(string: str)</code>: reverses the characters of
        <code>string</code> and adds it to the <code>str</code> stack
      </li>
      <li>
        <code>occurrence(search: str string: str)</code>: adds the number of
        occurrences of <code>search</code> in <code>string</code> to the
        <code>int</code> stack
      </li>
      <li>
        <code>replace(replacement: str search: str string: str)</code>: replaces
        the first occurrence of <code>search</code> with
        <code>replacement</code> in <code>string</code> and adds it to the
        <code>str</code> stack
      </li>
      <li>
        <code>replaceAll(replacement: str search: str string: str)</code>:
        replaces all occurrences of <code>search</code> with
        <code>replacement</code> in <code>string</code> and adds it to the
        <code>str</code> stack
      </li>
      <li>
        <code>repeat(string: str amount: int)</code>: repeats
        <code>string</code> <code>amount</code> times and adds the it to the
        <code>str</code> stack. <code>amount</code> must be greater than or
        equal to <code>0</code>
      </li>
      <li>
        <code>indexOf(search: str string: str)</code>: adds the index of the
        first occurrence of <code>search</code> in <code>string</code> to the
        <code>int</code> stack. If <code>search</code> is not in
        <code>string</code>, it adds <code>-1</code> to the
        <code>int</code>stack
      </li>
      <li>
        <code>lastIndexOf(search: str string: str)</code>: adds the index of the
        last occurrence of <code>search</code> in <code>string</code> to the
        <code>int</code> stack. If <code>search</code> is not in
        <code>string</code>, it adds <code>-1</code> to the
        <code>int</code>stack
      </li>
      <li>
        <code>charAt(string: str index: int)</code>: adds the character at index
        (starting at 0) <code>index</code> of <code>string</code> to the
        <code>str</code> stack. If there is no character at the index, it adds
        <code>""</code> to the <code>str</code> stack
      </li>
      <li>
        <code>charCodeAt(string: str index: int)</code>: adds the character code
        at index (starting at 0) <code>index</code> of <code>string</code> to
        the <code>int</code> stack. If there is no character at the index, an
        error occurs
      </li>
      <li>
        <code>codePointAt(string: str index: int)</code>: adds the code point of
        the character at index (starting at 0) <code>index</code> of
        <code>string</code> to the <code>int</code> stack. If there is no
        character at the index, an error occurs
      </li>
      <li>
        <code>slice(string: str endIndex: int startIndex: int)</code>: adds the
        the str made by extracting the characters from
        <code>startIndex</code> (starting at 0) up to but not including
        <code>endIndex</code> of <code>string</code> to the
        <code>str</code> stack.
      </li>
      <li>
        <code>split(separator: str string: str)</code>: splits
        <code>string</code> by <code>separator</code> and adds each item to the
        <code>str</code> stack such that the last item is on the top of the
        stack
      </li>
    </ul>
  </section>
</template>

<script lang="ts" setup>
import TypeStackEditor from "./Editor/TypeStackEditor.vue";
</script>

<style scoped>
.editor-wrapper {
  margin-top: calc(var(--block-spacing-vertical) / 3);
}
</style>
