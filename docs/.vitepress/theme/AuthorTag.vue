<template>
  <span 
    v-if="normalizedAuthor"
    class="author-badge-tag" 
    :class="[`author-${normalizedAuthor}`, { 'is-clickable': clickable }]"
    @click="handleClick"
    :title="displayAuthor"
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

const normalizedAuthor = computed(() => {
  const name = props.user || props.author || ''
  if (!name) return ''
  const lower = name.trim().toLowerCase()
  return lower === 'chen' ? 'chen' : (lower === 'zhao' ? 'zhao' : lower)
})

const displayAuthor = computed(() => {
  if (!normalizedAuthor.value) return ''
  if (normalizedAuthor.value === 'zhao') return 'Zhao'
  if (normalizedAuthor.value === 'chen') return 'Chen'
  return props.user || props.author || ''
})

const avatarLetter = computed(() => {
  return displayAuthor.value ? displayAuthor.value.charAt(0).toUpperCase() : ''
})

function handleClick() {
  if (!props.clickable || typeof window === 'undefined' || !normalizedAuthor.value) return
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
  gap: 4px;
  padding: 2px 7px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.3;
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
  width: 14px;
  height: 14px;
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
