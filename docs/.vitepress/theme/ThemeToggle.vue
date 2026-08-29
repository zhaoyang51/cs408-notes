<template>
  <div class="theme-switcher">
    <button 
      class="theme-btn" 
      :class="{ active: currentTheme === 'light' }" 
      @click="setTheme('light')" 
      title="浅白模式"
      aria-label="浅白模式"
    >
      <span class="icon">☀️</span>
      <span class="label">浅色</span>
    </button>
    <button 
      class="theme-btn parchment-btn" 
      :class="{ active: currentTheme === 'parchment' }" 
      @click="setTheme('parchment')" 
      title="羊皮纸护眼模式"
      aria-label="羊皮纸护眼模式"
    >
      <span class="icon">📜</span>
      <span class="label">羊皮纸</span>
    </button>
    <button 
      class="theme-btn" 
      :class="{ active: currentTheme === 'dark' }" 
      @click="setTheme('dark')" 
      title="深色夜间模式"
      aria-label="深色夜间模式"
    >
      <span class="icon">🌙</span>
      <span class="label">深色</span>
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
  const saved = localStorage.getItem('cs408-theme-mode') || localStorage.getItem('vitepress-theme-appearance') || 'light'
  if (saved === 'parchment' || document.documentElement.classList.contains('parchment')) {
    applyTheme('parchment')
  } else if (saved === 'dark' || document.documentElement.classList.contains('dark')) {
    applyTheme('dark')
  } else {
    applyTheme('light')
  }
})
</script>

<style scoped>
.theme-switcher {
  display: inline-flex;
  align-items: center;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  padding: 2px 3px;
  margin-left: 10px;
  gap: 2px;
  user-select: none;
}

.theme-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: none;
  background: transparent;
  padding: 3px 8px;
  border-radius: 14px;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s ease;
  line-height: 1.2;
}

.theme-btn:hover {
  color: var(--vp-c-text-1);
}

.theme-btn.active {
  background: var(--vp-c-bg);
  color: var(--vp-c-brand-1);
  font-weight: 600;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.theme-btn.parchment-btn.active {
  background: #f4ebd6;
  color: #8c5324;
}

@media (max-width: 768px) {
  .theme-btn .label {
    display: none;
  }
  .theme-btn {
    padding: 3px 6px;
  }
}
</style>
