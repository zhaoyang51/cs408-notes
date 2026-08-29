<template>
  <div class="theme-segmented-control" role="radiogroup" aria-label="选择站点阅读主题">
    <button 
      class="segment-btn" 
      :class="{ active: currentTheme === 'light' }" 
      @click="setTheme('light')" 
      title="浅色模式 (Light)"
      aria-label="浅色模式"
    >
      <span class="icon">☀️</span>
      <span class="text">浅白</span>
    </button>
    <button 
      class="segment-btn parchment-btn" 
      :class="{ active: currentTheme === 'parchment' }" 
      @click="setTheme('parchment')" 
      title="羊皮纸温润护眼模式 (Parchment)"
      aria-label="羊皮纸温润护眼模式"
    >
      <span class="icon">📜</span>
      <span class="text">羊皮纸</span>
    </button>
    <button 
      class="segment-btn" 
      :class="{ active: currentTheme === 'dark' }" 
      @click="setTheme('dark')" 
      title="深色暗黑夜间模式 (Dark)"
      aria-label="深色暗黑夜间模式"
    >
      <span class="icon">🌙</span>
      <span class="text">暗黑</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const currentTheme = ref('light')

function applyTheme(theme) {
  const root = document.documentElement
  root.classList.remove('dark', 'parchment')
  
  if (theme === 'dark') {
    root.classList.add('dark')
    localStorage.setItem('vitepress-theme-appearance', 'dark')
  } else if (theme === 'parchment') {
    root.classList.add('parchment')
    localStorage.setItem('vitepress-theme-appearance', 'parchment')
  } else {
    localStorage.setItem('vitepress-theme-appearance', 'light')
  }
  
  localStorage.setItem('cs408-theme-mode', theme)
  currentTheme.value = theme
}

function setTheme(theme) {
  applyTheme(theme)
}

onMounted(() => {
  const savedTheme = localStorage.getItem('cs408-theme-mode') || localStorage.getItem('vitepress-theme-appearance') || 'light'
  if (savedTheme === 'parchment' || document.documentElement.classList.contains('parchment')) {
    applyTheme('parchment')
  } else if (savedTheme === 'dark' || document.documentElement.classList.contains('dark')) {
    applyTheme('dark')
  } else {
    applyTheme('light')
  }
})
</script>

<style scoped>
.theme-segmented-control {
  display: inline-flex;
  align-items: center;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 9999px;
  padding: 2px 3px;
  margin-left: 8px;
  gap: 2px;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.04);
}

.segment-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: none;
  background: transparent;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  line-height: 1.2;
}

.segment-btn:hover {
  color: var(--vp-c-text-1);
}

.segment-btn.active {
  background: var(--vp-c-bg);
  color: var(--vp-c-brand-1);
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.segment-btn.parchment-btn.active {
  background: #fdf6e7;
  color: #8c5324;
}

@media (max-width: 768px) {
  .segment-btn .text {
    display: none;
  }
  .segment-btn {
    padding: 4px 6px;
  }
}
</style>
