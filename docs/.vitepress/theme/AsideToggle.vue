<template>
  <button
    class="aside-toggle-btn"
    :class="{ collapsed: isCollapsed }"
    :title="isCollapsed ? '展开本页大纲' : '收起本页大纲'"
    @click="toggle"
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline :points="isCollapsed ? '15 18 9 12 15 6' : '9 18 15 12 9 6'" />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const STORAGE_KEY = 'aside-collapsed'
const isCollapsed = ref(false)

function applyState(collapsed: boolean) {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('aside-collapsed', collapsed)
  }
}

function toggle() {
  isCollapsed.value = !isCollapsed.value
  applyState(isCollapsed.value)
  try { localStorage.setItem(STORAGE_KEY, String(isCollapsed.value)) } catch {}
}

onMounted(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'true') {
      isCollapsed.value = true
      applyState(true)
    }
  } catch {}
})

watch(isCollapsed, (v) => applyState(v))
</script>

<style scoped>
.aside-toggle-btn {
  position: fixed;
  z-index: 30;
  /* 定位在大纲区域左边缘 */
  right: 220px;
  top: calc(var(--vp-nav-height, 64px) + 54px);
  width: 22px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-right: none;
  border-radius: 6px 0 0 6px;
  color: var(--vp-c-text-3);
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
}

.aside-toggle-btn:hover {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
}

/* 收起状态：按钮贴到视口右边缘 */
.aside-toggle-btn.collapsed {
  right: 0;
  border-right: 1px solid var(--vp-c-divider);
  border-radius: 6px 0 0 6px;
}

/* ≤1279px 宽度下 VitePress 默认隐藏 aside，按钮也隐藏 */
@media (max-width: 1279px) {
  .aside-toggle-btn {
    display: none !important;
  }
}
</style>
