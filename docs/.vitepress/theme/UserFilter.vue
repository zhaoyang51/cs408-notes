<template>
  <div class="user-filter-control" role="radiogroup" aria-label="按贡献用户筛选知识点">
    <button 
      class="user-filter-btn" 
      :class="{ active: currentFilter === 'all' }" 
      @click="setFilter('all')" 
      title="查看所有用户创建的知识点"
      aria-label="全部用户"
    >
      <span class="user-icon">👥</span>
      <span class="user-text">全部</span>
    </button>
    <button 
      class="user-filter-btn zhao-btn" 
      :class="{ active: currentFilter === 'zhao' }" 
      @click="setFilter('zhao')" 
      title="仅查看 Zhao 创建的知识点"
      aria-label="Zhao 创建的知识点"
    >
      <span class="user-avatar zhao-avatar">Z</span>
      <span class="user-text">Zhao</span>
    </button>
    <button 
      class="user-filter-btn chen-btn" 
      :class="{ active: currentFilter === 'chen' }" 
      @click="setFilter('chen')" 
      title="仅查看 Chen 创建的知识点"
      aria-label="Chen 创建的知识点"
    >
      <span class="user-avatar chen-avatar">C</span>
      <span class="user-text">Chen</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const currentFilter = ref('all')

function applyFilter(filter) {
  const root = document.documentElement
  root.setAttribute('data-user-filter', filter)
  localStorage.setItem('cs408-user-filter', filter)
  currentFilter.value = filter
  
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cs408-user-filter-change', { detail: filter }))
  }
}

function setFilter(filter) {
  applyFilter(filter)
}

onMounted(() => {
  const savedFilter = localStorage.getItem('cs408-user-filter') || 'all'
  applyFilter(savedFilter)
})
</script>

<style scoped>
.user-filter-control {
  display: inline-flex;
  align-items: center;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 9999px;
  padding: 2px 3px;
  margin-left: 8px;
  gap: 2px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.04);
}

.user-filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: none;
  background: transparent;
  padding: 4px 9px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  line-height: 1.2;
  user-select: none;
}

.user-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 700;
  color: #ffffff;
}

.zhao-avatar {
  background: linear-gradient(135deg, #2563eb, #06b6d4);
}

.chen-avatar {
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
}

.user-filter-btn:hover {
  color: var(--vp-c-text-1);
}

.user-filter-btn.active {
  background: var(--vp-c-bg);
  color: var(--vp-c-brand-1);
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.user-filter-btn.zhao-btn.active {
  color: #0284c7;
}

.user-filter-btn.chen-btn.active {
  color: #9333ea;
}

@media (max-width: 768px) {
  .user-filter-btn .user-text {
    display: none;
  }
  .user-filter-btn {
    padding: 4px 6px;
  }
}
</style>
