<template>
  <div
    v-if="shouldShow"
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
import { useData } from 'vitepress'

const { frontmatter } = useData()
const shouldShow = computed(() => frontmatter.value?.layout !== 'home')
const STORAGE_KEY = 'cs408-aside-collapsed'
const isCollapsed = ref(false)
const rightPos = ref(228)
const topPos = ref(128)

const wrapStyle = computed(() => {
  return {
    top: `${topPos.value}px`,
    right: isCollapsed.value ? '0px' : `${rightPos.value}px`,
    transform: isCollapsed.value ? 'translate(0, -50%)' : 'translate(50%, -50%)'
  }
})

function updatePosition() {
  if (typeof window === 'undefined') return

  const outlineContent = document.querySelector('.VPDocAsideOutline .content') as HTMLElement | null
  const outlineTitle = document.querySelector('.VPDocAsideOutline .outline-title') as HTMLElement | null

  if (outlineContent) {
    const contentRect = outlineContent.getBoundingClientRect()
    const titleRect = outlineTitle ? outlineTitle.getBoundingClientRect() : contentRect
    
    // 当且仅当大纲处于展开且有实际宽度时记录坐标
    if (contentRect.width > 0 && contentRect.left > 0) {
      rightPos.value = Math.round(window.innerWidth - contentRect.left)
      topPos.value = Math.round(titleRect.top + titleRect.height / 2)
    }
  }
}

function applyState(collapsed: boolean) {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('aside-collapsed', collapsed)
  }
}

function toggle() {
  // 如果当前是展开状态，在收起前确保记录最新的精确位置
  if (!isCollapsed.value) {
    updatePosition()
  }
  
  isCollapsed.value = !isCollapsed.value
  applyState(isCollapsed.value)
  
  try {
    localStorage.setItem(STORAGE_KEY, String(isCollapsed.value))
  } catch {}

  // 展开后平滑动画结束时再次校验位置
  if (!isCollapsed.value) {
    nextTick(() => {
      setTimeout(updatePosition, 320)
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

  if (typeof MutationObserver !== 'undefined') {
    observer = new MutationObserver(() => {
      if (!isCollapsed.value) {
        updatePosition()
      }
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
  z-index: 99;
  transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: auto;
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
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              height 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              border-radius 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              background-color 0.2s ease,
              color 0.2s ease,
              box-shadow 0.2s ease;
  padding: 0;
}

.aside-border-toggle-btn:hover {
  background: var(--vp-c-brand-1);
  color: #ffffff;
  border-color: var(--vp-c-brand-1);
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

