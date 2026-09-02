<template>
  <div class="aside-border-toggle-wrap">
    <button
      class="aside-border-toggle-btn"
      :class="{ 'is-collapsed': isCollapsed }"
      :title="isCollapsed ? '展开本页大纲' : '收起本页大纲'"
      :aria-label="isCollapsed ? '展开本页大纲' : '收起本页大纲'"
      @click="toggle"
    >
      <svg class="toggle-icon" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <polyline v-if="!isCollapsed" points="9 18 15 12 9 6"></polyline>
        <polyline v-else points="15 18 9 12 15 6"></polyline>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const STORAGE_KEY = 'cs408-aside-collapsed'
const isCollapsed = ref(false)

function applyState(collapsed: boolean) {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('aside-collapsed', collapsed)
  }
}

function toggle() {
  isCollapsed.value = !isCollapsed.value
  applyState(isCollapsed.value)
  try {
    localStorage.setItem(STORAGE_KEY, String(isCollapsed.value))
  } catch {}
}

onMounted(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) === 'true'
    if (saved) {
      isCollapsed.value = true
      applyState(true)
    }
  } catch {}
})

watch(isCollapsed, (v) => applyState(v))
</script>

<style scoped>
.aside-border-toggle-wrap {
  position: fixed;
  top: 96px;
  right: 204px;
  transform: translateX(50%);
  z-index: 99;
  transition: right 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: auto;
}

html.aside-collapsed .aside-border-toggle-wrap {
  right: 0px;
  transform: translateX(0);
}

.aside-border-toggle-btn {
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
  padding: 0;
}

.aside-border-toggle-btn:hover {
  background: var(--vp-c-brand-1);
  color: #ffffff;
  border-color: var(--vp-c-brand-1);
  transform: scale(1.15);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
}

html.aside-collapsed .aside-border-toggle-btn {
  border-radius: 12px 0 0 12px;
  width: 20px;
  height: 36px;
  box-shadow: -2px 2px 8px rgba(0, 0, 0, 0.1);
}

/* ≤1279px 宽度下 VitePress 默认隐藏 aside，按钮也自动隐藏 */
@media (max-width: 1279px) {
  .aside-border-toggle-wrap {
    display: none !important;
  }
}
</style>

