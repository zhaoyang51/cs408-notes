<template>
  <div 
    class="kp-card" 
    :class="[
      `author-${normalizedAuthor}`,
      { 'is-active-filter': isMatchedFilter }
    ]"
    :data-author="normalizedAuthor"
  >
    <div class="kp-header" v-if="title || author || tag">
      <div class="kp-header-left">
        <span v-if="tag" class="kp-tag">{{ tag }}</span>
        <span v-if="title" class="kp-title">{{ title }}</span>
      </div>
      <div class="kp-header-right">
        <span class="kp-author-pill" :class="`${normalizedAuthor}-pill`" :title="`知识点贡献者: ${displayAuthor}`">
          <span class="kp-pill-avatar">{{ avatarLetter }}</span>
          <span class="kp-pill-name">{{ displayAuthor }}</span>
        </span>
      </div>
    </div>
    <div class="kp-body">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  author: {
    type: String,
    default: 'Zhao'
  },
  title: {
    type: String,
    default: ''
  },
  tag: {
    type: String,
    default: ''
  }
})

const currentFilter = ref('all')

const normalizedAuthor = computed(() => {
  const a = (props.author || 'zhao').toLowerCase()
  return a === 'chen' ? 'chen' : (a === 'zhao' ? 'zhao' : a)
})

const displayAuthor = computed(() => {
  if (normalizedAuthor.value === 'zhao') return 'Zhao'
  if (normalizedAuthor.value === 'chen') return 'Chen'
  return props.author || 'Zhao'
})

const avatarLetter = computed(() => {
  return displayAuthor.value.charAt(0).toUpperCase()
})

const isMatchedFilter = computed(() => {
  if (currentFilter.value === 'all') return true
  return currentFilter.value === normalizedAuthor.value
})

function handleFilterChange(e) {
  currentFilter.value = e.detail || 'all'
}

onMounted(() => {
  currentFilter.value = localStorage.getItem('cs408-user-filter') || 'all'
  if (typeof window !== 'undefined') {
    window.addEventListener('cs408-user-filter-change', handleFilterChange)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('cs408-user-filter-change', handleFilterChange)
  }
})
</script>

<style scoped>
.kp-card {
  position: relative;
  margin: 18px 0;
  border-radius: 12px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  box-shadow: var(--card-shadow);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.kp-card:hover {
  box-shadow: var(--card-hover-shadow);
  border-color: var(--vp-c-brand-1);
}

/* Zhao 专属卡片边框高亮 */
.kp-card.author-zhao {
  border-left: 4px solid #0284c7;
}

/* Chen 专属卡片边框高亮 */
.kp-card.author-chen {
  border-left: 4px solid #9333ea;
}

.kp-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
  gap: 12px;
}

.kp-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.kp-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 7px;
  border-radius: 6px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 11px;
  font-weight: 700;
  line-height: 1.3;
}

.kp-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.kp-header-right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.kp-author-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.2;
}

.kp-pill-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  font-size: 9px;
  font-weight: 800;
  color: #ffffff;
}

.zhao-pill {
  background: rgba(14, 165, 233, 0.12);
  color: #0284c7;
  border: 1px solid rgba(14, 165, 233, 0.35);
}
.zhao-pill .kp-pill-avatar {
  background: linear-gradient(135deg, #0284c7, #06b6d4);
}

.chen-pill {
  background: rgba(168, 85, 247, 0.12);
  color: #9333ea;
  border: 1px solid rgba(168, 85, 247, 0.35);
}
.chen-pill .kp-pill-avatar {
  background: linear-gradient(135deg, #9333ea, #ec4899);
}

.kp-body {
  padding: 14px 18px;
  font-size: 14.5px;
  line-height: 1.7;
}

.kp-body :deep(p:first-child) {
  margin-top: 0;
}

.kp-body :deep(p:last-child) {
  margin-bottom: 0;
}

/* 深色模式适配 */
:global(.dark) .zhao-pill {
  background: rgba(14, 165, 233, 0.2);
  color: #38bdf8;
  border-color: rgba(56, 189, 248, 0.4);
}
:global(.dark) .chen-pill {
  background: rgba(168, 85, 247, 0.2);
  color: #c084fc;
  border-color: rgba(192, 132, 252, 0.4);
}
</style>
