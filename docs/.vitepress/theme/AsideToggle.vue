<template>
  <div
    class="aside-border-toggle-wrap"
    :class="{ 'is-collapsed': isCollapsed }"
    :style="wrapStyle"
  >
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
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'

const STORAGE_KEY = 'cs408-aside-collapsed'
const isCollapsed = ref(false)
const pos = ref<{ left: number | null; top: number }>({ left: null, top: 96 })

const wrapStyle = computed(() => {
  if (isCollapsed.value || pos.value.left === null) {
    return {}
  }
  return {
    left: `${pos.value.left}px`,
    top: `${pos.value.top}px`,
    right: 'auto',
    transform: 'translate(-50%, -50%)'
  }
})

function updatePosition() {
  if (typeof window === 'undefined') return
  if (isCollapsed.value) return

  const outlineContent = document.querySelector('.VPDocAsideOutline .content') as HTMLElement | null
  const outlineTitle = document.querySelector('.VPDocAsideOutline .outline-title') as HTMLElement | null

  if (outlineContent) {
    const contentRect = outlineContent.getBoundingClientRect()
    const titleRect = outlineTitle ? outlineTitle.getBoundingClientRect() : contentRect
    
    // contentRect.left 为大纲左侧 border-left 分割线的精确 X 坐标
    // titleRect.top + titleRect.height / 2 为“本页大纲”标题垂直中心位置
    pos.value = {
      left: Math.round(contentRect.left),
      top: Math.round(titleRect.top + titleRect.height / 2)
    }
  }
}

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
  if (!isCollapsed.value) {
    nextTick(() => {
      setTimeout(updatePosition, 300)
    })
  }
}

let observer: MutationObserver | null = null

onMounted(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) === 'true'
    if (saved) {
      isCollapsed.value = true
      applyState(true)
    }
  } catch {}

  nextTick(() => {
    updatePosition()
    setTimeout(updatePosition, 200)
    setTimeout(updatePosition, 600)
  })

  window.addEventListener('resize', updatePosition, { passive: true })

  // 监听 DOM 树变化（例如路由切换或大纲异步加载）
  if (typeof MutationObserver !== 'undefined') {
    observer = new MutationObserver(() => {
      updatePosition()
    })
    const aside = document.querySelector('.VPDoc .aside') || document.body
    if (aside) {
      observer.observe(aside, { childList: true, subtree: true })
    }
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updatePosition)
  }
  if (observer) {
    observer.disconnect()
  }
})

watch(isCollapsed, (v) => applyState(v))
</script>

<style scoped>
.aside-border-toggle-wrap {
  position: fixed;
  top: 96px;
  right: 236px;
  transform: translate(50%, -50%);
  z-index: 99;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: auto;
}

.aside-border-toggle-wrap.is-collapsed {
  left: auto !important;
  right: 0px !important;
  top: 96px !important;
  transform: translateY(-50%) !important;
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

.aside-border-toggle-btn.is-collapsed {
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

