<template>
  <div class="mode-toggle-wrapper">
    <button 
      class="mode-toggle-btn" 
      :class="{ 'is-concise': isConcise }"
      type="button" 
      @click="toggleMode"
      :title="isConcise ? '当前为笔记模式（手写提炼考点），点击切换至完整模式' : '当前为完整模式，点击切换至笔记模式'"
    >
      <span class="mode-icon">{{ isConcise ? '📖' : '📚' }}</span>
      <span class="mode-text">{{ isConcise ? '笔记模式' : '完整模式' }}</span>
      <span class="mode-switch-hint">{{ isConcise ? '切至完整' : '切至笔记' }}</span>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter, useData } from 'vitepress'

const route = useRoute()
const router = useRouter()
const { site } = useData()

const isConcise = computed(() => {
  const path = route.path || ''
  return path.includes('/concise/') || path.endsWith('/concise') || path.endsWith('/concise.html')
})

function toggleMode() {
  const currentPath = route.path || '/'
  const base = site.value.base || '/'
  
  let targetPath = ''
  
  if (isConcise.value) {
    // 从简洁模式切换到完整模式
    targetPath = currentPath.replace('/concise/', '/').replace('/concise', '/')
    if (targetPath === base || targetPath === '') {
      targetPath = base
    }
  } else {
    // 从完整模式切换到简洁模式
    if (currentPath === base || currentPath === '/' || currentPath === base + 'index.html') {
      targetPath = base + 'concise/'
    } else {
      // 在 base 之后插入 concise/
      if (currentPath.startsWith(base)) {
        const subPath = currentPath.slice(base.length)
        targetPath = base + 'concise/' + subPath
      } else {
        targetPath = '/concise' + currentPath
      }
    }
  }
  
  // 规范化双斜杠
  targetPath = targetPath.replace(/([^:]\/)\/+/g, '$1')
  
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('cs408-mode-pref', isConcise.value ? 'interactive' : 'concise')
  }
  
  router.go(targetPath)
}
</script>

<style scoped>
.mode-toggle-wrapper {
  display: inline-flex;
  align-items: center;
}

.mode-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  line-height: 1.4;
}

.mode-toggle-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-elv);
  box-shadow: 0 2px 8px -2px rgba(37, 99, 235, 0.15);
}

.mode-toggle-btn.is-concise {
  background: rgba(16, 185, 129, 0.08);
  border-color: rgba(16, 185, 129, 0.35);
  color: #059669;
}

.mode-toggle-btn.is-concise:hover {
  background: rgba(16, 185, 129, 0.15);
  border-color: #059669;
}

.mode-icon {
  font-size: 13px;
  line-height: 1;
}

.mode-text {
  font-weight: 700;
}

.mode-switch-hint {
  font-size: 10.5px;
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-3);
  font-weight: 500;
  transition: all 0.2s ease;
}

.mode-toggle-btn:hover .mode-switch-hint {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.mode-toggle-btn.is-concise .mode-switch-hint {
  background: rgba(16, 185, 129, 0.15);
  color: #059669;
}

@media (max-width: 1440px) {
  .mode-switch-hint {
    display: none;
  }
  .mode-toggle-btn {
    padding: 3px 8px;
  }
}

@media (max-width: 1150px) {
  .mode-toggle-btn {
    padding: 3px 6px;
    gap: 3px;
  }
}
</style>

