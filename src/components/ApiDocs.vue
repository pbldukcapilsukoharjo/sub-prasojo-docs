<script setup lang="ts">
import { reactive } from 'vue'
import { ApiReference } from '@scalar/api-reference'
import openApiSpec from '../../openapi.yaml'

const config = reactive<any>({
  spec: {
    content: openApiSpec,
  },
  theme: 'elysiajs',
  showSidebar: true,
  layout: 'modern',
  darkMode: true,
})
</script>

<template>
  <div class="api-docs-container">
    <ApiReference :configuration="config" />
  </div>
</template>

<style>
@import '@scalar/api-reference/style.css';

.api-docs-container {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99;
  background-color: #000;
}


.scalar-app, .scalar-api-reference {
  width: 100% !important;
  height: 100% !important;
}
</style>