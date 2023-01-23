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

    <details>
      <summary role="button" class="secondary">TypeStack Stacks</summary>
      <div>
        <p>
          TypeStack has 4 stacks, 1 stack for each type: <code>int</code>,
          <code>float</code>, <code>str</code> and <code>bool</code>. Whenever
          you use a type value, the stack type changes. The stack type can also
          change when you use a type keyword: <code>int</code>,
          <code>float</code>, <code>str</code> or <code>bool</code> and enter or
          exit loops and if statements.
        </p>
        <p>
          The stack type is important as you can only call functions on certain
          types and functions are called on the stack type.
        </p>
      </div>
    </details>

    <details>
      <summary role="button" class="secondary">Examples</summary>
      <div>
        <h3 id="examples">Example FizzBuzz Program</h3>
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
      </div>
    </details>

    <details>
      <summary role="button" class="secondary">Expressions</summary>
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
          <strong>Identifiers</strong>: Identifiers are most other values that
          do not start with a number, double quote, bracket or parenthesis and
          are not keywords. Identifiers are normally calls to functions but can
          also be function parameters.
          <TypeStackEditor
            :code="`# valid identifiers
value - item2
# invalid identifiers
true 33k f()`"
          />
        </li>
      </ul>
    </details>

    <details>
      <summary role="button" class="secondary">Statements</summary>
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
          <code>bool</code> stack is <code>false</code>. The loop consumes the
          top of the stack each time, meaning that the condition will have to be
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
          <code>int</code> stack is <code>0</code>. At the end of each cycle,
          the top of the <code>int</code> stack is incremented or decremented by
          <code>1</code> so it is closer to <code>0</code>. If there are no
          <code>int</code>s on the stack then the program will error. The stack
          type before the loop can be <code>any</code> type but the type
          starting the loop block and leaving the loop is <code>int</code>.
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
    </details>

    <details>
      <summary role="button" class="secondary">Functions</summary>
      <div>
        <p>
          Functions allow you to reuse code. Each function can only operate on
          certain types and can take the tops of stacks as input. TypeStack has
          many standard library functions that are available in any program. For
          example, the <code>-</code> function can subtract two integers or two
          floats.
        </p>

        <h3>Syntax</h3>
        <TypeStackEditor
          :code="`fn identifier(param: str) @str {
    # function contents
}`"
        />
        <p>
          Functions start with the <code>fn</code> keyword followed by an
          identifier that is the name of the function. Parameters for the
          function are made by providing an identifier in the brackets and
          having an optional colon followed by a type. If no type is given for a
          parameter, it defaults to the type of the function. The type of the
          function is given by the <code>@type</code> value after the
          parameters. This type is the only type that the function can be called
          on. The type can be one of the 4 stack types or <code>any</code>,
          which allows it to be called on any stack.
        </p>

        <h3>Parameters</h3>
        <p>
          Function parameters can have any type. Parameters remove the top of
          their stack in the order that they come in the brackets. To use
          parameters, you just need to type the identifier in the function
          block.
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

        <h3>Other Important Function Information</h3>
        <ul>
          <li>
            Functions are hoisted to the top of the program, meaning that you
            can call a function before the function is declared
          </li>
          <li>
            The block of a function always starts with a stack type of the
            function type
          </li>
          <li>
            Functions can have the same name as other functions with different
            function types. When calling one of these functions, only the
            function of the current stack type is run.
          </li>
          <li>
            Functions with the same name and same type as other defined
            functions overload the previous functions
          </li>
          <li>
            Functions cannot be declared within any block (<code>if</code>
            statements, <code>loop</code> etc.)
          </li>
        </ul>
      </div>
    </details>

    <details>
      <summary role="button" class="secondary">Modules</summary>
      <div>
        <h3>Importing Modules</h3>
        <TypeStackEditor :code="`import Math`" />
        <p>
          Importing modules must occur at the top of the program using the
          <code>import</code> keyword followed by the module name. Note:
          importing modules modules on the browser will cause an error. Modules
          come pre-imported.
        </p>

        <h3>Running Module Functions</h3>
        <TypeStackEditor
          :code="`import Math

55 Math.neg`"
        />
        <p>
          Run module functions by prefixing the function with the module name
          followed by a period <code>.</code>. This syntax prevents the
          likelihood of overwriting other functions in the program.
        </p>
      </div>
    </details>

    <details>
      <summary role="button" class="secondary">
        Standard Library Functions
      </summary>
      <div>
        <template
          v-for="(functions, type) in functionDocs.standardLibrary"
          :key="type"
        >
          <h3>
            <code>{{ type }}</code>
          </h3>
          <ul>
            <li v-for="(description, funcName) in functions" :key="funcName">
              <code>{{ funcName }}</code
              >: <span v-html="description"></span>
            </li>
          </ul>
        </template>
      </div>
    </details>

    <details>
      <summary role="button" class="secondary">Built In Modules</summary>
      <div>
        <template
          v-for="(moduleNameValue, moduleName) in functionDocs.modules"
          :key="moduleName"
        >
          <h3>{{ moduleName }}</h3>
          <template v-for="(functions, type) in moduleNameValue" :key="type">
            <h4>
              <code>{{ type }}</code>
            </h4>
            <ul>
              <li v-for="(description, funcName) in functions" :key="funcName">
                <code>{{ funcName }}</code
                >: <span v-html="description"></span>
              </li>
            </ul>
          </template>
        </template>
      </div>
    </details>
  </section>
</template>

<script lang="ts" setup>
import TypeStackEditor from "./Editor/TypeStackEditor.vue";
import functionDocs from "@/assets/functionDocs.json";
</script>

<style scoped>
.editor-wrapper {
  margin-top: calc(var(--block-spacing-vertical) / 3);
}
</style>
