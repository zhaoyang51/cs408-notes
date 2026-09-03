<template>
  <div class="theme-control-wrapper" ref="wrapperRef">
    <!-- 桌面宽屏模式：3 个分段按钮 -->
    <div class="theme-segmented-control full-theme-control" role="radiogroup" aria-label="选择站点阅读主题与颜色">
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
        title="自定义全站主题色与羊皮纸浓度"
        aria-label="自定义主题与浓度"
      >
        <span class="color-preview-dot" :style="{ backgroundColor: activeColor }"></span>
        <span class="text">自定义</span>
      </button>
    </div>

    <!-- 紧凑/缩放屏幕模式：单药丸复合按钮 (自适应窄屏) -->
    <div class="compact-theme-control">
      <button 
        class="compact-theme-btn" 
        :class="{ 'is-parchment': currentTheme === 'parchment', active: isColorMatrixOpen }"
        @click="toggleColorMatrix" 
        title="切换阅读主题与配色"
        type="button"
      >
        <span class="icon">{{ currentTheme === 'parchment' ? '📜' : '☀️' }}</span>
        <span class="text">{{ currentTheme === 'parchment' ? '羊皮纸' : '浅白' }}</span>
        <span class="color-preview-dot" :style="{ backgroundColor: activeColor }"></span>
        <span class="dropdown-arrow" :class="{ 'is-open': isColorMatrixOpen }">▾</span>
      </button>
    </div>

    <!-- 自定义主题色与羊皮纸浓度悬浮面板 (Popover) -->
    <transition name="matrix-pop">
      <div class="color-matrix-popover" v-if="isColorMatrixOpen">
        <div class="matrix-arrow"></div>
        
        <!-- 紧凑模式下的快捷主题切换栏 -->
        <div class="popover-theme-switch">
          <div class="switch-title">📖 阅读底色模式</div>
          <div class="switch-btn-group">
            <button 
              class="quick-theme-btn" 
              :class="{ active: currentTheme === 'light' }"
              @click="setTheme('light')"
            >
              <span>☀️ 浅白模式</span>
            </button>
            <button 
              class="quick-theme-btn parchment" 
              :class="{ active: currentTheme === 'parchment' }"
              @click="setTheme('parchment')"
            >
              <span>📜 羊皮纸护眼</span>
            </button>
          </div>
        </div>

        <!-- 模块 1: 全站主题主色矩阵 -->
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

        <!-- 模块 2: 📜 羊皮纸色浓度自主调节 -->
        <div class="parchment-adjust-section">
          <div class="parchment-header">
            <div class="header-title">
              <span class="title-icon">📜</span>
              <span>羊皮纸护眼色浓度</span>
            </div>
            <span class="intensity-badge">{{ parchmentIntensity }}%</span>
          </div>

          <div class="slider-wrapper">
            <span class="slider-label">清浅</span>
            <input 
              type="range" 
              min="10" 
              max="100" 
              step="1"
              v-model.number="parchmentIntensity" 
              @input="onParchmentSliderChange"
              class="parchment-range-slider"
              title="滑动调节羊皮纸背景色彩深度"
            />
            <span class="slider-label">浓醇</span>
          </div>

          <!-- 快捷档位预设 -->
          <div class="parchment-preset-chips">
            <button 
              class="chip-btn" 
              :class="{ active: Math.abs(parchmentIntensity - 20) <= 5 }"
              @click="setParchmentIntensity(20)"
              title="淡雅奶白轻护眼 (20%)"
            >
              淡雅 20%
            </button>
            <button 
              class="chip-btn" 
              :class="{ active: Math.abs(parchmentIntensity - 50) <= 5 }"
              @click="setParchmentIntensity(50)"
              title="温润柔和标准羊皮纸 (50%)"
            >
              温润 50%
            </button>
            <button 
              class="chip-btn" 
              :class="{ active: Math.abs(parchmentIntensity - 75) <= 5 }"
              @click="setParchmentIntensity(75)"
              title="沉浸复古古籍色 (75%)"
            >
              古籍 75%
            </button>
            <button 
              class="chip-btn" 
              :class="{ active: Math.abs(parchmentIntensity - 100) <= 5 }"
              @click="setParchmentIntensity(100)"
              title="浓醇宣纸怀旧色 (100%)"
            >
              浓醇 100%
            </button>
          </div>
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

// 羊皮纸色浓度百分比 (10% ~ 100%，默认 50%)
const parchmentIntensity = ref(50)

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

// 动态计算羊皮纸背景色彩体系
function calculateParchmentColors(intensity) {
  const t = Math.min(100, Math.max(10, intensity))
  const factor = (t - 10) / 90 // 0 to 1

  let r, g, b
  if (factor <= 0.44) {
    const subFactor = factor / 0.44
    // 从极淡素雅 (253, 250, 244) 插值到 标准温润 (246, 238, 219)
    r = Math.round(253 + (246 - 253) * subFactor)
    g = Math.round(250 + (238 - 250) * subFactor)
    b = Math.round(244 + (219 - 244) * subFactor)
  } else {
    const subFactor = (factor - 0.44) / 0.56
    // 从标准温润 (246, 238, 219) 插值到 浓醇宣纸 (228, 210, 172)
    r = Math.round(246 + (228 - 246) * subFactor)
    g = Math.round(238 + (210 - 238) * subFactor)
    b = Math.round(219 + (172 - 219) * subFactor)
  }

  const bg = `rgb(${r}, ${g}, ${b})`
  const bgSoft = `rgb(${r - 11}, ${g - 15}, ${b - 23})`
  const bgAlt = `rgb(${r - 8}, ${g - 11}, ${b - 16})`
  const bgElv = `rgb(${Math.min(255, r + 5)}, ${Math.min(255, g + 7)}, ${Math.min(255, b + 10)})`
  const sidebarBg = `rgb(${r - 5}, ${g - 8}, ${b - 13})`
  const navBg = `rgb(${r}, ${g}, ${b})`
  const codeBlockBg = `rgb(${r - 15}, ${g - 20}, ${b - 27})`
  const codeBg = `rgb(${r - 11}, ${g - 18}, ${b - 24})`
  const divider = `rgba(180, 150, 100, ${0.18 + factor * 0.15})`
  const border = `rgba(160, 130, 80, ${0.25 + factor * 0.15})`

  return {
    bg, bgSoft, bgAlt, bgElv, sidebarBg, navBg, codeBlockBg, codeBg, divider, border
  }
}

function applyParchmentStyles(intensity) {
  if (typeof window === 'undefined') return
  const root = document.documentElement
  
  if (currentTheme.value === 'parchment') {
    const colors = calculateParchmentColors(intensity)
    root.style.setProperty('--vp-c-bg', colors.bg)
    root.style.setProperty('--vp-c-bg-soft', colors.bgSoft)
    root.style.setProperty('--vp-c-bg-alt', colors.bgAlt)
    root.style.setProperty('--vp-c-bg-elv', colors.bgElv)
    root.style.setProperty('--vp-sidebar-bg-color', colors.sidebarBg)
    root.style.setProperty('--vp-nav-bg-color', colors.navBg)
    root.style.setProperty('--vp-code-block-bg', colors.codeBlockBg)
    root.style.setProperty('--vp-code-bg', colors.codeBg)
    root.style.setProperty('--vp-c-divider', colors.divider)
    root.style.setProperty('--vp-c-border', colors.border)
    root.style.setProperty('--vp-c-text-1', '#342618')
    root.style.setProperty('--vp-c-text-2', '#5c4731')
  } else {
    // 浅白模式时清除背景相关的 inline styles，还原纯白
    const bgProps = [
      '--vp-c-bg', '--vp-c-bg-soft', '--vp-c-bg-alt', '--vp-c-bg-elv',
      '--vp-sidebar-bg-color', '--vp-nav-bg-color', '--vp-code-block-bg',
      '--vp-code-bg', '--vp-c-divider', '--vp-c-border', '--vp-c-text-1', '--vp-c-text-2'
    ]
    bgProps.forEach(p => root.style.removeProperty(p))
  }
}

function setParchmentIntensity(val) {
  parchmentIntensity.value = val
  localStorage.setItem('cs408-parchment-intensity', String(val))
  
  // 如果当前不是羊皮纸模式，自动切换到羊皮纸并应用
  if (currentTheme.value !== 'parchment') {
    applyTheme('parchment')
  } else {
    applyParchmentStyles(val)
  }
}

function onParchmentSliderChange(e) {
  const val = Number(e.target.value)
  setParchmentIntensity(val)
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
    currentTheme.value = 'parchment'
    applyParchmentStyles(parchmentIntensity.value)
  } else {
    localStorage.setItem('vitepress-theme-appearance', 'light')
    localStorage.setItem('cs408-theme-mode', 'light')
    currentTheme.value = 'light'
    applyParchmentStyles(parchmentIntensity.value)
  }
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
  // 恢复羊皮纸色浓度设定
  const savedIntensity = localStorage.getItem('cs408-parchment-intensity')
  if (savedIntensity) {
    parchmentIntensity.value = Number(savedIntensity)
  }

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
   颜色矩阵与浓度浮层面板 (Color Matrix & Intensity Popover)
   ══════════════════════════════════════════════════════════════════ */
.color-matrix-popover {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 260px;
  padding: 14px 16px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 14px;
  box-shadow: 0 12px 32px -4px rgba(0, 0, 0, 0.18), 0 4px 12px rgba(0, 0, 0, 0.08);
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
  margin-bottom: 10px;
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
  padding: 6px 0 10px 0;
  border-bottom: 1px solid var(--vp-c-divider);
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
  width: 18px;
  height: 18px;
  border-radius: 5px;
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

/* ══════════════════════════════════════════════════════════════════
   📜 羊皮纸色浓度调节模块
   ══════════════════════════════════════════════════════════════════ */
.parchment-adjust-section {
  margin-top: 10px;
}

.parchment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.intensity-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 9999px;
  background: #fdf6e7;
  color: #8c5324;
  border: 1px solid #ebd4a8;
}

.slider-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.slider-label {
  font-size: 10.5px;
  color: var(--vp-c-text-3);
  user-select: none;
}

.parchment-range-slider {
  flex: 1;
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  border-radius: 9999px;
  background: linear-gradient(90deg, #faf7f0 0%, #f6eedb 50%, #e6d4af 100%);
  border: 1px solid var(--vp-c-divider);
  outline: none;
  cursor: pointer;
}

.parchment-range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #8c5324;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.15s ease;
}

.parchment-range-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.parchment-range-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #8c5324;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

/* 档位预设小胶囊 */
.parchment-preset-chips {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
}

.chip-btn {
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  border-radius: 6px;
  padding: 3px 2px;
  font-size: 10.5px;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.chip-btn:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-brand-1);
}

.chip-btn.active {
  background: #fdf6e7;
  color: #8c5324;
  border-color: #d97706;
  font-weight: 700;
}

/* 紧凑单按钮模式与响应式适配 */
.full-theme-control {
  display: inline-flex;
}

.compact-theme-control {
  display: none;
}

.compact-theme-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  padding: 3px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  line-height: 1.4;
  user-select: none;
}

.compact-theme-btn:hover,
.compact-theme-btn.active {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-elv);
  box-shadow: 0 2px 8px -2px rgba(37, 99, 235, 0.15);
}

.compact-theme-btn.is-parchment {
  background: #fdf6e7;
  color: #8c5324;
  border-color: rgba(140, 83, 36, 0.25);
}

.compact-theme-btn.is-parchment:hover {
  background: #faebd7;
  border-color: #8c5324;
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

/* 悬浮面板顶部的模式快速切换 */
.popover-theme-switch {
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.switch-title {
  font-size: 11px;
  font-weight: 700;
  color: var(--vp-c-text-3);
  margin-bottom: 7px;
}

.switch-btn-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.quick-theme-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  transition: all 0.2s ease;
}

.quick-theme-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.quick-theme-btn.active {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  box-shadow: 0 2px 6px -1px rgba(37, 99, 235, 0.15);
}

.quick-theme-btn.parchment.active {
  background: #fdf6e7;
  border-color: #8c5324;
  color: #8c5324;
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

/* 屏幕尺寸自适应断点：<= 1400px 或放大时自动切换为紧凑单按钮 */
@media (max-width: 1400px) {
  .full-theme-control {
    display: none !important;
  }
  .compact-theme-control {
    display: inline-flex !important;
  }
}

@media (max-width: 768px) {
  .color-matrix-popover {
    right: -20px;
    width: 250px;
  }
}
</style>

