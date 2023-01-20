<script lang="ts">
export default {
  name: "TheGettingStarted",
};
</script>

<template>
  <section>
    <h2 id="gettingStarted">Getting Started</h2>
    <h3>Command Line</h3>
    <h4>Installation</h4>
    <pre><code>npm install typestack-lang -g</code></pre>
    <h4>Run a File</h4>
    <pre><code>typestack filename.txt</code></pre>
    <h3>JavaScript/TypeScript</h3>
    <h4>Installation</h4>
    <pre><code>npm install typestack-lang</code></pre>
    <h4>Run a Script</h4>
    <pre><code><span class="token-keyword">import</span> typestack <span class="token-keyword">from</span> <span class="token-string">"typestack-lang/dist/index.js"</span>;

<span class="token-keyword">await</span> <span class="token-identifier">typestack</span>(<span class="token-string">`
<span v-html="highlight(typeStackCode)"></span>
`</span>);</code></pre>
  </section>
</template>

<script lang="ts" setup>
import Highlighter from "./Editor/highlight";
import "./Editor/style.css";

const highlight = (code: string) => {
  return new Highlighter(code).run();
};

const typeStackCode = `100 for loop {
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
}`;
</script>
