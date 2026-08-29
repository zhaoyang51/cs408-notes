<template>
  <div class="error-sim-wrapper">
    <iframe 
      :src="iframeSrc" 
      class="error-iframe"
      title="三大差错检验机制交互式可视化实验室"
      frameborder="0"
      scrolling="no"
    ></iframe>
  </div>
</template>

<script setup>
import { withBase } from 'vitepress'
import { computed } from 'vue'

const iframeSrc = computed(() => withBase('/simulators/error-check.html'))
</script>

<style scoped>
.error-sim-wrapper {
  margin: 20px 0;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--vp-c-border);
  box-shadow: var(--card-shadow);
  background: var(--vp-c-bg-elv);
}

.error-iframe {
  width: 100%;
  height: 520px;
  display: block;
  border: none;
}

@media (max-width: 768px) {
  .error-iframe {
    height: 580px;
  }
}
</style>
