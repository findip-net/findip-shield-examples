<script setup lang="ts">
import SignupForm from './SignupForm.vue';
</script>

<template>
  <main>
    <h1>Create your account</h1>
    <SignupForm />
  </main>
</template>

<style>
main {
  font-family: system-ui, sans-serif;
  max-width: 420px;
  margin: 48px auto;
  padding: 0 16px;
}
input {
  display: block;
  width: 100%;
  margin: 4px 0 12px;
  padding: 8px;
  box-sizing: border-box;
}
</style>
