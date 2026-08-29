<template>
  <span 
    class="author-badge-tag" 
    :class="[normalizedAuthor ? `author-${normalizedAuthor}` : '', { 'is-clickable': clickable }]"
    @click="handleClick"
    :title="clickable ? `点击仅查看 ${displayAuthor} 创建的内容` : `创建者: ${displayAuthor}`"
  >
    <span class="author-avatar" :class="`${normalizedAuthor}-avatar`">
      {{ avatarLetter }}
    </span>
    <span class="author-name">{{ displayAuthor }}</span>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  user: {
    type: String,
    default: ''
  },
  author: {
    type: String,
    default: ''
  },
  clickable: {
    type: Boolean,
    default: true
  }
})

const displayAuthor = computed(() => {
  const name = props.user || props.author || 'Zhao'
  if (name.toLowerCase() === 'zhao') return 'Zhao'
  if (name.toLowerCase() === 'chen') return 'Chen'
  return name
})

const normalizedAuthor = computed(() => {
  const name = props.user || props.author || 'zhao'
  return name.toLowerCase()
})

const avatarLetter = computed(() => {
  return displayAuthor.value.charAt(0).toUpperCase()
})

function handleClick() {
  if (!props.clickable || typeof window === 'undefined') return
  const filter = normalizedAuthor.value
  const root = document.documentElement
  root.setAttribute('data-user-filter', filter)
  localStorage.setItem('cs408-user-filter', filter)
  window.dispatchEvent(new CustomEvent('cs408-user-filter-change', { detail: filter }))
}
</script>

<style scoped>
.author-badge-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.4;
  vertical-align: middle;
  transition: all 0.2s ease;
  user-select: none;
}

.author-badge-tag.is-clickable {
  cursor: pointer;
}

.author-badge-tag.is-clickable:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}

.author-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  font-size: 9px;
  font-weight: 800;
  color: #ffffff;
}

/* Zhao 配色方案 (科技蓝青) */
.author-zhao {
  background: rgba(14, 165, 233, 0.12);
  color: #0284c7;
  border: 1px solid rgba(14, 165, 233, 0.35);
}
.zhao-avatar {
  background: linear-gradient(135deg, #0284c7, #06b6d4);
}

/* Chen 配色方案 (优雅紫粉) */
.author-chen {
  background: rgba(168, 85, 247, 0.12);
  color: #9333ea;
  border: 1px solid rgba(168, 85, 247, 0.35);
}
.chen-avatar {
  background: linear-gradient(135deg, #9333ea, #ec4899);
}

/* 暗黑模式自适应 */
:global(.dark) .author-zhao {
  background: rgba(14, 165, 233, 0.2);
  color: #38bdf8;
  border-color: rgba(56, 189, 248, 0.4);
}
:global(.dark) .author-chen {
  background: rgba(168, 85, 247, 0.2);
  color: #c084fc;
  border-color: rgba(192, 132, 252, 0.4);
}

/* 羊皮纸模式自适应 */
:global(html.parchment) .author-zhao {
  background: rgba(14, 116, 144, 0.15);
  color: #0e7490;
  border-color: rgba(14, 116, 144, 0.35);
}
:global(html.parchment) .author-chen {
  background: rgba(126, 34, 206, 0.12);
  color: #7e22ce;
  border-color: rgba(126, 34, 206, 0.35);
}
</style>
