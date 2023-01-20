<script lang="ts">
export default {
  name: "TheHeader",
};
</script>

<template>
  <header class="container">
    <section>
      <div class="headings">
        <h1>TypeStack</h1>
        <p>A stack-based, type-safe programing language</p>
      </div>
      <TypeStackEditor :code="code" class="editor" />
      <small
        >This editor does not support the <code>read</code> function and modules
        come pre-imported</small
      >
      <div class="button-container">
        <button class="secondary" @click="scrollToGetStarted()">
          Get Started
        </button>
        <button class="contrast outline" @click="scrollToTheBasics()">
          Documentation
        </button>
      </div>
    </section>
  </header>
</template>

<script lang="ts" setup>
import TypeStackEditor from "@/components/Editor/TypeStackEditor.vue";
const code =
  '# Click the play button in the top right corner to run\n"Hello, World!" print';
const scrollToGetStarted = () => {
  document.querySelector("#gettingStarted")?.scrollIntoView({
    behavior: "smooth",
  });
};
const scrollToTheBasics = () => {
  document.querySelector("#theBasics")?.scrollIntoView({
    behavior: "smooth",
  });
};
</script>

<style scoped>
h1 {
  font-weight: 800;
  font-size: 2.5rem;
  text-align: center;
}
.headings p {
  text-align: center;
}

.button-container {
  display: flex;
  justify-content: center;
}
button {
  width: auto;
  display: inline;
  margin-right: var(--block-spacing-horizontal);
}
.editor-wrapper {
  margin-bottom: 0;
}
small {
  margin-top: var(--form-element-spacing-vertical);
  margin-bottom: var(--form-element-spacing-vertical);
  text-align: center;
  display: block;
}
</style>
