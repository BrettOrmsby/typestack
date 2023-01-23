<script lang="ts">
export default {
  name: "TypeStackEditor",
};
</script>

<template>
  <div class="editor-wrapper">
    <div style="position: relative">
      <button class="run-code" @click="runCode(text, consoleFunc)">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
      </button>
    </div>
    <PrismEditor v-model="text" :highlight="highlight" :line-numbers="true" />
    <pre class="console" ref="consoleElement"></pre>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { PrismEditor } from "vue-prism-editor";
import AnsiUp from "ansi_up";
import Highlight from "./highlight";
import runCode from "./runCode";
import "vue-prism-editor/dist/prismeditor.min.css";
import "firacode/distr/fira_code.css";
import "./style.css";

const props = defineProps<{ code: string }>();

const text = ref(props.code);
const consoleElement = ref<HTMLPreElement>();

const highlight = (input: string) => new Highlight(input).run();

const ansiUp = new AnsiUp();
ansiUp.use_classes = true;

const consoleFunc = (string: string) => {
  if (consoleElement.value) {
    if (consoleElement.value.style.display !== "block") {
      consoleElement.value.style.display = "block";
    }
    // if the text is the first text logged and it starts with a newline, replace it with nothing
    // do this because errors start with newlines and do not look good with the console like that
    if (consoleElement.value.innerText === "" && string.startsWith("\n")) {
      string = string.replace("\n", "");
    }
    consoleElement.value.innerHTML += ansiUp.ansi_to_html(string) + "\n";
  }
};
</script>

<style scoped>
:deep() .prism-editor__line-numbers {
  border-right: 1px solid #44475a;
  padding: 0 0.5em;
  margin-right: 0.2em;
}
.editor-wrapper {
  background: #282a36;
  color: #f8f8f2;
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-variant-ligatures: none;
  font-size: 14px;
  line-height: 1.5;
}
.console {
  overflow: auto;
  margin: 0;
  padding: 1em;
  border-top: 1px solid #44475a;
  height: 200px;
  /* reset pico.css styling */
  border-radius: 0;
  background: #282a36;
  color: #f8f8f2;
  font-weight: unset;
  line-height: initial;
  font-size: 0.875em;
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  display: none;
}

:deep() :is(.prism-editor__textarea, .prism-editor__editor) {
  padding-top: 0.5em;
}
.run-code {
  all: unset;
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  z-index: 1;
  color: #6272a4;
  line-height: 1;
  cursor: pointer;
}
.run-code:hover {
  color: #566590;
}

.prism-editor-wrapper {
  overflow: auto;
  width: 100%;
  height: 200px;
}
:deep() .prism-editor__container {
  min-height: 200px;
}

/* So the line numbers grow when hitting 2 and 3 digits */
:deep() .prism-editor__line-width-calc {
  display: none;
}
:deep() .prism-editor__textarea:focus {
  outline: none;
}

/* line number fix, see: https://github.com/koca/vue-prism-editor/issues/87#issuecomment-726228705 */
:deep() .prism-editor__textarea {
  width: 999999px !important;
}
:deep() .prism-editor__editor {
  white-space: pre !important;
}
:deep() .prism-editor__container {
  overflow-x: scroll !important;
}
</style>
