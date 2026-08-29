<template>
  <div class="theme-control-wrapper" ref="wrapperRef">
    <div class="theme-segmented-control" role="radiogroup" aria-label="选择站点阅读主题与颜色">
      <button 
        class="segment-btn" 
        :class="{ active: currentTheme === 'light' }" 
        @click="setTheme('light')" 
        title="浅白模式 (Light)"
        aria-label="浅白模式"
      >
        <span class="icon">☀️</span>
        <span class="text">浅白</span>
      </button>

      <button 
        class="segment-btn parchment-btn" 
        :class="{ active: currentTheme === 'parchment' }" 
        @click="setTheme('parchment')" 
        title="羊皮纸温润护眼模式 (Parchment)"
        aria-label="羊皮纸温润护眼模式"
      >
        <span class="icon">📜</span>
        <span class="text">羊皮纸</span>
      </button>

      <button 
        class="segment-btn custom-color-btn" 
        :class="{ active: isColorMatrixOpen }" 
        @click="toggleColorMatrix" 
        title="自定义全站主题颜色"
        aria-label="自定义主题颜色"
      >
        <span class="color-preview-dot" :style="{ backgroundColor: activeColor }"></span>
        <span class="text">自定义</span>
      </button>
    </div>

    <!-- 颜色矩阵悬浮弹窗 (Color Matrix Popover) -->
    <transition name="matrix-pop">
      <div class="color-matrix-popover" v-if="isColorMatrixOpen">
        <div class="matrix-arrow"></div>
        <div class="matrix-header">
          <div class="header-title">
            <span class="title-icon">🎨</span>
            <span>自选主题颜色矩阵</span>
          </div>
          <button class="reset-btn" @click="resetToDefaultColor" title="恢复默认科技蓝">
            恢复默认
          </button>
        </div>

        <!-- 12 种精选预设颜色矩阵 -->
        <div class="matrix-grid">
          <div 
            v-for="color in presetColors" 
            :key="color.hex"
            class="matrix-color-item"
            :class="{ selected: activeColor.toLowerCase() === color.hex.toLowerCase() }"
            :style="{ backgroundColor: color.hex }"
            :title="`${color.name} (${color.hex})`"
            @click="selectColor(color.hex)"
          >
            <span class="check-icon" v-if="activeColor.toLowerCase() === color.hex.toLowerCase()">✓</span>
          </div>
        </div>

        <!-- 自由拾色器与 Hex 输入 -->
        <div class="custom-picker-section">
          <div class="picker-left">
            <span class="picker-label">自由调色：</span>
            <div class="color-input-wrap" :style="{ backgroundColor: activeColor }">
              <input 
                type="color" 
                v-model="activeColor" 
                @input="onColorInput" 
                class="native-color-picker"
                title="打开系统调色盘"
              />
            </div>
            <span class="color-hex-val">{{ activeColor.toUpperCase() }}</span>
          </div>
          <span class="picker-tip">即时生效</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const currentTheme = ref('light')
const isColorMatrixOpen = ref(false)
const wrapperRef = ref(null)

const DEFAULT_BRAND_COLOR = '#2563eb'
const activeColor = ref(DEFAULT_BRAND_COLOR)

// 12 种预设优质主题色矩阵
const presetColors = [
  { name: '经典科技蓝', hex: '#2563eb' },
  { name: '翡翠生机绿', hex: '#059669' },
  { name: '极光深邃紫', hex: '#7c3aed' },
  { name: '活力樱花粉', hex: '#e11d48' },
  { name: '暖阳活力橙', hex: '#ea580c' },
  { name: '天青碧波蓝', hex: '#0891b2' },
  { name: '松针深青色', hex: '#0d9488' },
  { name: '复古琥珀金', hex: '#d97706' },
  { name: '优雅洋酒红', hex: '#be123c' },
  { name: '梦幻薰衣草', hex: '#9333ea' },
  { name: '幽静森林绿', hex: '#15803d' },
  { name: '极简曜石灰', hex: '#334155' }
]

function hexToRgb(hex) {
  let c = hex.replace('#', '')
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('')
  }
  const num = parseInt(c, 16)
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  }
}

// 根据主色计算并应用阶梯品牌色系统
function applyBrandColor(hex) {
  if (!hex || typeof window === 'undefined') return
  
  const root = document.documentElement
  const rgb = hexToRgb(hex)
  
  // 主色
  root.style.setProperty('--vp-c-brand-1', hex)
  
  // 浅一度与深一度计算
  const brand2 = `rgb(${Math.min(255, Math.round(rgb.r * 1.15))}, ${Math.min(255, Math.round(rgb.g * 1.15))}, ${Math.min(255, Math.round(rgb.b * 1.15))})`
  const brand3 = `rgb(${Math.min(255, Math.round(rgb.r * 1.3))}, ${Math.min(255, Math.round(rgb.g * 1.3))}, ${Math.min(255, Math.round(rgb.b * 1.3))})`
  const brandSoft = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)`
  
  root.style.setProperty('--vp-c-brand-2', brand2)
  root.style.setProperty('--vp-c-brand-3', brand3)
  root.style.setProperty('--vp-c-brand-soft', brandSoft)
  
  activeColor.value = hex
  localStorage.setItem('cs408-brand-color', hex)
}

function selectColor(hex) {
  applyBrandColor(hex)
}

function onColorInput(e) {
  applyBrandColor(e.target.value)
}

function resetToDefaultColor() {
  applyBrandColor(DEFAULT_BRAND_COLOR)
}

function toggleColorMatrix() {
  isColorMatrixOpen.value = !isColorMatrixOpen.value
}

function applyTheme(theme) {
  const root = document.documentElement
  root.classList.remove('dark', 'parchment')
  
  if (theme === 'parchment') {
    root.classList.add('parchment')
    localStorage.setItem('vitepress-theme-appearance', 'parchment')
    localStorage.setItem('cs408-theme-mode', 'parchment')
  } else {
    localStorage.setItem('vitepress-theme-appearance', 'light')
    localStorage.setItem('cs408-theme-mode', 'light')
  }
  
  currentTheme.value = theme
}

function setTheme(theme) {
  applyTheme(theme)
}

function handleOutsideClick(e) {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target)) {
    isColorMatrixOpen.value = false
  }
}

onMounted(() => {
  // 恢复主题底色（仅浅白 / 羊皮纸）
  const savedTheme = localStorage.getItem('cs408-theme-mode') || localStorage.getItem('vitepress-theme-appearance') || 'light'
  if (savedTheme === 'parchment' || document.documentElement.classList.contains('parchment')) {
    applyTheme('parchment')
  } else {
    applyTheme('light')
  }
  
  // 恢复自定义品牌颜色
  const savedColor = localStorage.getItem('cs408-brand-color') || DEFAULT_BRAND_COLOR
  applyBrandColor(savedColor)
  
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
.theme-control-wrapper {
  position: relative;
  display: inline-flex;
}

.theme-segmented-control {
  display: inline-flex;
  align-items: center;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 9999px;
  padding: 2px 3px;
  margin-left: 0;
  gap: 2px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.04);
}

.segment-btn {
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

.segment-btn:hover {
  color: var(--vp-c-text-1);
}

.segment-btn.active {
  background: var(--vp-c-bg);
  color: var(--vp-c-brand-1);
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.segment-btn.parchment-btn.active {
  background: #fdf6e7;
  color: #8c5324;
}

.color-preview-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1.5px solid #ffffff;
  box-shadow: 0 0 0 1px var(--vp-c-divider);
  transition: transform 0.2s ease;
}

.segment-btn.custom-color-btn.active .color-preview-dot {
  transform: scale(1.2);
}

/* ══════════════════════════════════════════════════════════════════
   颜色矩阵浮层面板 (Color Matrix Popover)
   ══════════════════════════════════════════════════════════════════ */
.color-matrix-popover {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 240px;
  padding: 12px 14px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  box-shadow: 0 10px 28px -4px rgba(0, 0, 0, 0.18), 0 4px 10px rgba(0, 0, 0, 0.08);
  z-index: 1000;
  backdrop-filter: blur(12px);
}

.matrix-arrow {
  position: absolute;
  top: -5px;
  right: 28px;
  width: 10px;
  height: 10px;
  background: var(--vp-c-bg-elv);
  border-left: 1px solid var(--vp-c-border);
  border-top: 1px solid var(--vp-c-border);
  transform: rotate(45deg);
}

.matrix-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.reset-btn {
  border: none;
  background: transparent;
  font-size: 11px;
  color: var(--vp-c-brand-1);
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
  font-weight: 600;
  transition: opacity 0.2s;
}

.reset-btn:hover {
  opacity: 0.8;
  text-decoration: underline;
}

/* 12 色矩阵网格 (4列 x 3行) */
.matrix-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.matrix-color-item {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
  position: relative;
}

.matrix-color-item:hover {
  transform: scale(1.15);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 2;
}

.matrix-color-item.selected {
  transform: scale(1.08);
  box-shadow: 0 0 0 2px var(--vp-c-bg-elv), 0 0 0 4px var(--vp-c-text-1);
}

.check-icon {
  color: #ffffff;
  font-size: 12px;
  font-weight: 900;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
}

/* 自由拾色器栏 */
.custom-picker-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
  border-top: 1px solid var(--vp-c-divider);
}

.picker-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.picker-label {
  font-size: 11px;
  color: var(--vp-c-text-2);
}

.color-input-wrap {
  position: relative;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-border);
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.native-color-picker {
  position: absolute;
  top: -5px;
  left: -5px;
  width: 30px;
  height: 30px;
  opacity: 0;
  cursor: pointer;
}

.color-hex-val {
  font-size: 11px;
  font-weight: 700;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-1);
}

.picker-tip {
  font-size: 10px;
  color: var(--vp-c-text-3);
}

/* 动画效果 */
.matrix-pop-enter-active,
.matrix-pop-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.matrix-pop-enter-from,
.matrix-pop-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.96);
}

@media (max-width: 768px) {
  .segment-btn .text {
    display: none;
  }
  .segment-btn {
    padding: 4px 6px;
  }
  .color-matrix-popover {
    right: -20px;
  }
}
</style>
