<template>
  <div v-if="shouldShow" class="sidebar-border-toggle-wrap">
    <button 
      class="sidebar-border-toggle-btn"
      :class="{ 'is-collapsed': isSidebarCollapsed }"
      @click="toggleSidebar"
      :title="isSidebarCollapsed ? '展开左侧目录 (展开)' : '收起左侧目录 (收起)'"
      :aria-label="isSidebarCollapsed ? '展开左侧目录' : '收起左侧目录'"
    >
      <svg class="toggle-icon" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <polyline v-if="!isSidebarCollapsed" points="15 18 9 12 15 6"></polyline>
        <polyline v-else points="9 18 15 12 9 6"></polyline>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useData } from 'vitepress'

const { frontmatter } = useData()
const shouldShow = computed(() => frontmatter.value?.layout !== 'home')
const isSidebarCollapsed = ref(false)

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
  const savedSidebar = localStorage.getItem('cs408-sidebar-collapsed') === 'true'
  if (savedSidebar) {
    isSidebarCollapsed.value = true
    document.documentElement.classList.add('sidebar-collapsed')
  }
})
</script>

<style scoped>
.sidebar-border-toggle-wrap {
  position: fixed;
  top: 100px;
  left: var(--vp-sidebar-width);
  transform: translateX(-50%);
  z-index: 99;
  transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: auto;
}

html.sidebar-collapsed .sidebar-border-toggle-wrap {
  left: 0px;
  transform: translateX(0);
}

.sidebar-border-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-2);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-border-toggle-btn:hover {
  background: var(--vp-c-brand-1);
  color: #ffffff;
  border-color: var(--vp-c-brand-1);
  transform: scale(1.15);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
}

html.sidebar-collapsed .sidebar-border-toggle-btn {
  border-radius: 0 12px 12px 0;
  width: 20px;
  height: 36px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 960px) {
  .sidebar-border-toggle-wrap {
    display: none !important;
  }
}
</style>
