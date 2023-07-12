---
layout: false
---

<div ref="el" id="root" />

<script setup>
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { ref, onMounted } from 'vue'
import App from './app'

const el = ref()
onMounted(() => {
  const root = createRoot(el.value)
  root.render(createElement(App, {}, null))
})
</script>

<style scoped>

</style>
