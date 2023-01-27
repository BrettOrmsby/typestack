<script lang="ts">
export default {
  name: "TheFooter",
};
</script>

<template>
  <footer class="container-fluid">
    <nav aria-label="breadcrumb">
      <ul>
        <li><a href="#gettingStarted">Getting Started</a></li>
        <li><a href="#theBasics">Documentation</a></li>
        <li><a href="https://github.com/BrettOrmsby/typestack">Github</a></li>
      </ul>
    </nav>
    <p>
      <small>© Brett Ormsby 2022-{{ new Date().getFullYear() }}</small>
    </p>
  </footer>
</template>

<script lang="ts" setup></script>

<style scoped>
footer {
  background-color: var(--card-sectionning-background-color);
  padding: var(--spacing);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-top: var(--border-width) solid var(--muted-border-color);
}
footer p {
  margin-bottom: var(--nav-element-spacing-vertical);
  color: var(--muted-color);
}
ul {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: var(--nav-element-spacing-vertical);
}
li,
a {
  padding-bottom: 0;
}
</style>
