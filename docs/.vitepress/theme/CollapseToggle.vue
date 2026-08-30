<template>
  <div class="collapse-toggle-wrapper">
    <button 
      class="collapse-toggle-btn" 
      :class="{ 'is-expanded': isAllExpanded }"
      type="button" 
      @click="toggleCollapseAll"
      :title="isAllExpanded ? '当前为全部展开，点击一键收起所有折叠内容' : '当前为默认收起，点击一键展开所有折叠内容与解析'"
    >
      <span class="btn-icon">{{ isAllExpanded ? '📁' : '📂' }}</span>
      <span class="btn-text">{{ isAllExpanded ? '全部收起' : '全部展开' }}</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isAllExpanded = ref(false)

function toggleCollapseAll() {
  isAllExpanded.value = !isAllExpanded.value
  
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('cs408-collapse-all-pref', isAllExpanded.value ? 'expand' : 'collapse')
  }
  
  // 广播全局折叠/展开事件
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cs408-toggle-collapse-all', {
      detail: { expand: isAllExpanded.value }
    }))
    
    // 兼容原生 details 标签
    document.querySelectorAll('details').forEach(el => {
      el.open = isAllExpanded.value
    })
  }
}

onMounted(() => {
  if (typeof localStorage !== 'undefined') {
    const pref = localStorage.getItem('cs408-collapse-all-pref')
    if (pref === 'expand') {
      isAllExpanded.value = true
      // 延时广播，确保子组件已挂载
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('cs408-toggle-collapse-all', {
          detail: { expand: true }
        }))
        document.querySelectorAll('details').forEach(el => {
          el.open = true
        })
      }, 100)
    }
  }
})
</script>

<style scoped>
.collapse-toggle-wrapper {
  display: inline-flex;
  align-items: center;
}

.collapse-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 9px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  line-height: 1.4;
}

.collapse-toggle-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-elv);
  box-shadow: 0 2px 8px -2px rgba(37, 99, 235, 0.15);
}

.collapse-toggle-btn.is-expanded {
  background: rgba(217, 119, 6, 0.08);
  border-color: rgba(217, 119, 6, 0.35);
  color: #d97706;
}

.collapse-toggle-btn.is-expanded:hover {
  background: rgba(217, 119, 6, 0.15);
  border-color: #d97706;
}

.btn-icon {
  font-size: 12px;
  line-height: 1;
}

.btn-text {
  font-weight: 700;
}
</style>
