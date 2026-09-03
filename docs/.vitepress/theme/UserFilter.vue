<template>
  <div class="user-filter-control" role="radiogroup" aria-label="按贡献用户筛选知识点">
    <!-- 桌面宽屏模式：3 个平铺按钮 -->
    <div class="full-filter-group">
      <!-- 全部用户按钮及悬浮统计卡片 -->
      <div class="filter-item-wrapper" @mouseenter="hovered = 'all'" @mouseleave="hovered = null">
        <button 
          class="user-filter-btn" 
          :class="{ active: currentFilter === 'all' }" 
          @click="setFilter('all')" 
          title="查看所有用户创建的知识点"
          aria-label="全部用户"
        >
          <span class="user-icon">👥</span>
          <span class="user-text">全部</span>
          <span class="count-pill">{{ stats.all.total }}</span>
        </button>

        <!-- 悬浮弹窗 -->
        <transition name="popover-fade">
          <div class="stats-popover all-popover" v-if="hovered === 'all'">
            <div class="popover-arrow"></div>
            <div class="popover-header">
              <span class="popover-title">👥 用户贡献考点统计</span>
              <span class="popover-badge">共 {{ stats.all.total }} 个考点</span>
            </div>
            <div class="popover-body">
              <div class="user-stat-row">
                <div class="stat-left">
                  <span class="mini-avatar zhao-mini">Z</span>
                  <span class="stat-name">Zhao</span>
                </div>
                <span class="stat-count zhao-text">{{ stats.zhao.total }} 个考点</span>
              </div>
              <div class="user-stat-row">
                <div class="stat-left">
                  <span class="mini-avatar chen-mini">C</span>
                  <span class="stat-name">Chen</span>
                </div>
                <span class="stat-count chen-text">{{ stats.chen.total }} 个考点</span>
              </div>
              <div class="popover-progress-bar" v-if="stats.all.total > 0">
                <div class="progress-zhao" :style="{ width: `${(stats.zhao.total / stats.all.total) * 100}%` }"></div>
                <div class="progress-chen" :style="{ width: `${(stats.chen.total / stats.all.total) * 100}%` }"></div>
              </div>
            </div>
            <div class="popover-tip">💡 显示所有公共知识与全部用户贡献内容</div>
          </div>
        </transition>
      </div>

      <!-- Zhao 按钮及悬浮统计卡片 -->
      <div class="filter-item-wrapper" @mouseenter="hovered = 'zhao'" @mouseleave="hovered = null">
        <button 
          class="user-filter-btn zhao-btn" 
          :class="{ active: currentFilter === 'zhao' }" 
          @click="setFilter('zhao')" 
          title="仅查看公共部分与 Zhao 创建的考点"
          aria-label="仅查看 Zhao"
        >
          <span class="user-avatar zhao-avatar">Z</span>
          <span class="user-text">Zhao</span>
          <span class="count-pill zhao-pill">{{ stats.zhao.total }}</span>
        </button>

        <!-- 悬浮弹窗 -->
        <transition name="popover-fade">
          <div class="stats-popover zhao-popover" v-if="hovered === 'zhao'">
            <div class="popover-arrow"></div>
            <div class="popover-header">
              <div class="header-user">
                <span class="mini-avatar zhao-mini">Z</span>
                <span class="popover-title">Zhao 创建考点</span>
              </div>
              <span class="popover-badge zhao-badge">{{ stats.zhao.total }} 个考点</span>
            </div>
            <div class="popover-grid">
              <div class="subject-stat-pill ds">
                <span class="sub-name">🟢 数据结构</span>
                <span class="sub-num">{{ stats.zhao.bySubject.ds }}</span>
              </div>
              <div class="subject-stat-pill co">
                <span class="sub-name">🔵 计组</span>
                <span class="sub-num">{{ stats.zhao.bySubject.co }}</span>
              </div>
              <div class="subject-stat-pill os">
                <span class="sub-name">🟣 操作系统</span>
                <span class="sub-num">{{ stats.zhao.bySubject.os }}</span>
              </div>
              <div class="subject-stat-pill cn">
                <span class="sub-name">🟠 计网</span>
                <span class="sub-num">{{ stats.zhao.bySubject.cn }}</span>
              </div>
            </div>
            <div class="popover-tip">⚡ 仅显示公共部分与 Zhao 创建内容</div>
          </div>
        </transition>
      </div>

      <!-- Chen 按钮及悬浮统计卡片 -->
      <div class="filter-item-wrapper" @mouseenter="hovered = 'chen'" @mouseleave="hovered = null">
        <button 
          class="user-filter-btn chen-btn" 
          :class="{ active: currentFilter === 'chen' }" 
          @click="setFilter('chen')" 
          title="仅查看公共部分与 Chen 创建的考点"
          aria-label="仅查看 Chen"
        >
          <span class="user-avatar chen-avatar">C</span>
          <span class="user-text">Chen</span>
          <span class="count-pill chen-pill">{{ stats.chen.total }}</span>
        </button>

        <!-- 悬浮弹窗 -->
        <transition name="popover-fade">
          <div class="stats-popover chen-popover" v-if="hovered === 'chen'">
            <div class="popover-arrow"></div>
            <div class="popover-header">
              <div class="header-user">
                <span class="mini-avatar chen-mini">C</span>
                <span class="popover-title">Chen 创建考点</span>
              </div>
              <span class="popover-badge chen-badge">{{ stats.chen.total }} 个考点</span>
            </div>
            <div class="popover-grid">
              <div class="subject-stat-pill ds">
                <span class="sub-name">🟢 数据结构</span>
                <span class="sub-num">{{ stats.chen.bySubject.ds }}</span>
              </div>
              <div class="subject-stat-pill co">
                <span class="sub-name">🔵 计组</span>
                <span class="sub-num">{{ stats.chen.bySubject.co }}</span>
              </div>
              <div class="subject-stat-pill os">
                <span class="sub-name">🟣 操作系统</span>
                <span class="sub-num">{{ stats.chen.bySubject.os }}</span>
              </div>
              <div class="subject-stat-pill cn">
                <span class="sub-name">🟠 计网</span>
                <span class="sub-num">{{ stats.chen.bySubject.cn }}</span>
              </div>
            </div>
            <div class="popover-tip">⚡ 仅显示公共部分与 Chen 创建内容</div>
          </div>
        </transition>
      </div>
    </div>

    <!-- 紧凑/缩放屏幕模式：单药丸复合下拉按钮 -->
    <div class="compact-filter-dropdown" ref="dropdownRef">
      <button 
        class="compact-trigger-btn"
        :class="{
          'is-zhao': currentFilter === 'zhao',
          'is-chen': currentFilter === 'chen',
          'is-open': isDropdownOpen
        }"
        type="button"
        @click="isDropdownOpen = !isDropdownOpen"
        title="按贡献作者筛选（点击展开）"
      >
        <span v-if="currentFilter === 'all'" class="user-icon">👥</span>
        <span v-else-if="currentFilter === 'zhao'" class="user-avatar zhao-avatar">Z</span>
        <span v-else class="user-avatar chen-avatar">C</span>

        <span class="compact-user-text">
          {{ currentFilter === 'all' ? '全部' : (currentFilter === 'zhao' ? 'Zhao' : 'Chen') }}
        </span>
        <span class="count-pill" :class="{ 'zhao-pill': currentFilter === 'zhao', 'chen-pill': currentFilter === 'chen' }">
          {{ stats[currentFilter]?.total || 0 }}
        </span>
        <span class="dropdown-arrow" :class="{ 'is-open': isDropdownOpen }">▾</span>
      </button>

      <!-- 紧凑下拉弹窗 -->
      <transition name="popover-fade">
        <div class="compact-dropdown-menu" v-if="isDropdownOpen">
          <div class="dropdown-header">
            <span>👥 考点作者筛选</span>
            <span class="total-badge">共 {{ stats.all.total }} 个</span>
          </div>
          <div class="dropdown-options">
            <button 
              class="dropdown-option" 
              :class="{ selected: currentFilter === 'all' }"
              @click="selectFilterAndClose('all')"
            >
              <div class="opt-left">
                <span class="user-icon">👥</span>
                <span class="opt-name">全部作者考点</span>
              </div>
              <span class="opt-count">{{ stats.all.total }}</span>
            </button>

            <button 
              class="dropdown-option" 
              :class="{ selected: currentFilter === 'zhao' }"
              @click="selectFilterAndClose('zhao')"
            >
              <div class="opt-left">
                <span class="mini-avatar zhao-mini">Z</span>
                <span class="opt-name">Zhao 独家考点</span>
              </div>
              <span class="opt-count zhao-text">{{ stats.zhao.total }}</span>
            </button>

            <button 
              class="dropdown-option" 
              :class="{ selected: currentFilter === 'chen' }"
              @click="selectFilterAndClose('chen')"
            >
              <div class="opt-left">
                <span class="mini-avatar chen-mini">C</span>
                <span class="opt-name">Chen 独家考点</span>
              </div>
              <span class="opt-count chen-text">{{ stats.chen.total }}</span>
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { data as stats } from './stats.data.ts'

const currentFilter = ref('all')
const hovered = ref(null)
const isDropdownOpen = ref(false)
const dropdownRef = ref(null)

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

function selectFilterAndClose(filter) {
  applyFilter(filter)
  isDropdownOpen.value = false
}

function handleOutsideClick(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  const savedFilter = localStorage.getItem('cs408-user-filter') || 'all'
  applyFilter(savedFilter)
  if (typeof window !== 'undefined') {
    window.addEventListener('click', handleOutsideClick)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('click', handleOutsideClick)
  }
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
  margin-left: 0;
  gap: 2px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.04);
  position: relative;
}

.filter-item-wrapper {
  position: relative;
  display: inline-flex;
}

.user-filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: none;
  background: transparent;
  padding: 4px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  line-height: 1.2;
  user-select: none;
}

.count-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1px 5px;
  border-radius: 9999px;
  font-size: 10px;
  font-weight: 700;
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-3);
  line-height: 1;
}

.count-pill.zhao-pill {
  background: rgba(14, 165, 233, 0.15);
  color: #0284c7;
}

.count-pill.chen-pill {
  background: rgba(168, 85, 247, 0.15);
  color: #9333ea;
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

/* ══════════════════════════════════════════════════════════════════
   悬浮统计气泡卡片 (Stats Popover)
   ══════════════════════════════════════════════════════════════════ */
.stats-popover {
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  width: 220px;
  padding: 12px 14px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  box-shadow: 0 10px 28px -4px rgba(0, 0, 0, 0.18), 0 4px 10px rgba(0, 0, 0, 0.08);
  z-index: 1000;
  pointer-events: none;
  backdrop-filter: blur(12px);
}

.popover-arrow {
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 10px;
  height: 10px;
  background: var(--vp-c-bg-elv);
  border-left: 1px solid var(--vp-c-border);
  border-top: 1px solid var(--vp-c-border);
}

.popover-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.header-user {
  display: flex;
  align-items: center;
  gap: 6px;
}

.popover-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.popover-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 9999px;
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-2);
}

.popover-badge.zhao-badge {
  background: rgba(14, 165, 233, 0.15);
  color: #0284c7;
}

.popover-badge.chen-badge {
  background: rgba(168, 85, 247, 0.15);
  color: #9333ea;
}

.user-stat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 6px;
}

.stat-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.mini-avatar {
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

.zhao-mini { background: linear-gradient(135deg, #0284c7, #06b6d4); }
.chen-mini { background: linear-gradient(135deg, #9333ea, #ec4899); }

.stat-name {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.stat-count {
  font-weight: 700;
}

.zhao-text { color: #0284c7; }
.chen-text { color: #9333ea; }

.popover-progress-bar {
  display: flex;
  height: 5px;
  border-radius: 9999px;
  overflow: hidden;
  margin-top: 8px;
  background: var(--vp-c-bg-alt);
}

.progress-zhao {
  background: #0284c7;
  height: 100%;
}

.progress-chen {
  background: #9333ea;
  height: 100%;
}

.popover-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-bottom: 8px;
}

.subject-stat-pill {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 6px;
  border-radius: 6px;
  background: var(--vp-c-bg-alt);
  font-size: 11px;
}

.sub-name {
  color: var(--vp-c-text-2);
  font-size: 10.5px;
}

.sub-num {
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.popover-tip {
  font-size: 10.5px;
  color: var(--vp-c-text-3);
  margin-top: 6px;
  text-align: center;
  line-height: 1.3;
}

/* 过渡动画 */
.popover-fade-enter-active,
.popover-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.popover-fade-enter-from,
.popover-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-6px) scale(0.96);
}

/* 宽屏与紧凑模式切换 */
.full-filter-group {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.compact-filter-dropdown {
  display: none;
  position: relative;
}

.compact-trigger-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: none;
  background: transparent;
  padding: 3px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s ease;
  line-height: 1.4;
  user-select: none;
}

.compact-trigger-btn:hover,
.compact-trigger-btn.is-open {
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-brand-1);
  box-shadow: 0 2px 8px -2px rgba(37, 99, 235, 0.15);
}

.compact-trigger-btn.is-zhao {
  color: #2563eb;
}

.compact-trigger-btn.is-chen {
  color: #9333ea;
}

.dropdown-arrow {
  font-size: 10px;
  color: var(--vp-c-text-3);
  transition: transform 0.2s ease;
  line-height: 1;
}

.dropdown-arrow.is-open {
  transform: rotate(180deg);
}

/* 紧凑下拉弹窗菜单 */
.compact-dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 200px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.15);
  z-index: 100;
  backdrop-filter: blur(12px);
}

.dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 6px 8px;
  font-size: 11px;
  font-weight: 700;
  color: var(--vp-c-text-3);
  border-bottom: 1px solid var(--vp-c-divider);
  margin-bottom: 6px;
}

.total-badge {
  background: var(--vp-c-bg-alt);
  padding: 1px 6px;
  border-radius: 9999px;
  font-size: 10px;
}

.dropdown-options {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.dropdown-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  border-radius: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  width: 100%;
  font-size: 12px;
  color: var(--vp-c-text-2);
  transition: all 0.15s ease;
}

.dropdown-option:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.dropdown-option.selected {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 700;
}

.opt-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.opt-count {
  font-size: 11px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 9999px;
  background: var(--vp-c-bg-alt);
}

/* 响应式断点：<= 1400px 或缩放时自动切换为紧凑单药丸下拉 */
@media (max-width: 1400px) {
  .full-filter-group {
    display: none !important;
  }
  .compact-filter-dropdown {
    display: inline-flex !important;
  }
}

@media (max-width: 768px) {
  .stats-popover {
    display: none !important;
  }
}
</style>

