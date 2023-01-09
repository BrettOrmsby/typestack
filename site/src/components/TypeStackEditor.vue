<script lang="ts">
export default {
  name: "TypeStackEditor",
};
</script>

<template>
  <PrismEditor class="my-editor" v-model="code" :highlight="highlight" />
  <pre ref="consoleElement"></pre>
  <button @click="runCode(code, consoleFunc)">Run</button>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { PrismEditor } from "vue-prism-editor";
import { default as AnsiUp } from "ansi_up";
import Highlight from "../utils/highlight";
import runCode from "../utils/runCode";
import "vue-prism-editor/dist/prismeditor.min.css";

const consoleElement = ref<HTMLPreElement>();
const code = ref("55 33 -");
const highlight = (input: string) => new Highlight(input).run();

const ansiUp = new AnsiUp();
const consoleFunc = (string: string) => {
  if (consoleElement.value) {
    consoleElement.value.innerHTML += ansiUp.ansi_to_html(string);
  }
};
</script>

<style scoped>
:deep() .token-number {
  color: blue;
}
:deep() .token-str {
  color: yellow;
}
:deep() .token-bool {
  color: purple;
}
:deep() .token-comment {
  color: gray;
}
:deep() .token-keyword {
  color: red;
}
:deep() .token-identifier {
  color: green;
}
:deep() .token-punctuation {
  color: white;
}
/* required class */
.my-editor {
  /* we dont use `language-` classes anymore so thats why we need to add background and text color manually */
  background: #2d2d2d;
  color: #ccc;

  /* you must provide font-family font-size line-height. Example: */
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}

/* optional class for removing the outline */
.prism-editor__textarea:focus {
  outline: none;
}
</style>
