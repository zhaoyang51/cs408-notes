<template>
  <div class="mux-sim-wrapper">
    <iframe 
      :src="iframeSrc" 
      class="mux-iframe"
      title="信道复用技术交互式教学实验室"
      frameborder="0"
      scrolling="no"
    ></iframe>
  </div>
</template>

<script setup>
import { withBase } from 'vitepress'
import { computed } from 'vue'

const iframeSrc = computed(() => withBase('/simulators/multiplexing.html'))
</script>

<style scoped>
.mux-sim-wrapper {
  margin: 20px 0;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--vp-c-border);
  box-shadow: var(--card-shadow);
  background: var(--vp-c-bg-elv);
}

.mux-iframe {
  width: 100%;
  height: 520px;
  display: block;
  border: none;
}

@media (max-width: 768px) {
  .mux-iframe {
    height: 580px;
  }
}
</style>
