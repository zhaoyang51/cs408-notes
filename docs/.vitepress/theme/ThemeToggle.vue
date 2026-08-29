<template>
  <div class="nav-controls">
    <!-- 侧边栏收起/展开快捷按钮 -->
    <button 
      class="sidebar-toggle-btn" 
      @click="toggleSidebar" 
      :title="isSidebarCollapsed ? '展开目录栏' : '收起目录栏'"
      :aria-label="isSidebarCollapsed ? '展开目录栏' : '收起目录栏'"
    >
      <svg v-if="!isSidebarCollapsed" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="9" y1="3" x2="9" y2="21"></line>
        <path d="M14 9l-3 3 3 3"></path>
      </svg>
      <svg v-else viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="9" y1="3" x2="9" y2="21"></line>
        <path d="M12 9l3 3-3 3"></path>
      </svg>
      <span class="btn-text">{{ isSidebarCollapsed ? '展开目录' : '收起目录' }}</span>
    </button>

    <!-- 三态主题切换器 -->
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const currentTheme = ref('light')
const isSidebarCollapsed = ref(false)

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

function toggleSidebar() {
  const root = document.documentElement
  isSidebarCollapsed.value = !isSidebarCollapsed.value
  if (isSidebarCollapsed.value) {
    root.classList.add('sidebar-collapsed')
    localStorage.setItem('cs408-sidebar-collapsed', 'true')
  } else {
    root.classList.remove('sidebar-collapsed')
    localStorage.setItem('cs408-sidebar-collapsed', 'false')
  }
}

onMounted(() => {
  // Theme initialization
  const savedTheme = localStorage.getItem('cs408-theme-mode') || localStorage.getItem('vitepress-theme-appearance') || 'light'
  if (savedTheme === 'parchment' || document.documentElement.classList.contains('parchment')) {
    applyTheme('parchment')
  } else if (savedTheme === 'dark' || document.documentElement.classList.contains('dark')) {
    applyTheme('dark')
  } else {
    applyTheme('light')
  }

  // Sidebar collapsed initialization
  const savedSidebar = localStorage.getItem('cs408-sidebar-collapsed') === 'true'
  if (savedSidebar) {
    isSidebarCollapsed.value = true
    document.documentElement.classList.add('sidebar-collapsed')
  }
})
</script>

<style scoped>
.nav-controls {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: 8px;
}

.sidebar-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 9999px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s ease;
  line-height: 1.2;
}

.sidebar-toggle-btn:hover {
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.theme-segmented-control {
  display: inline-flex;
  align-items: center;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 9999px;
  padding: 2px 3px;
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

@media (max-width: 960px) {
  .sidebar-toggle-btn {
    display: none;
  }
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
