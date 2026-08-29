<template>
  <div class="mindmap-widget" :class="{ 'is-fullscreen': isFullscreen }">
    <!-- 头部工具栏 -->
    <div class="widget-header">
      <div class="header-info">
        <span class="widget-tag">{{ tag }}</span>
        <h3 class="widget-title">{{ title }}</h3>
      </div>

      <div class="toolbar-actions">
        <!-- 缩放控制工具组 -->
        <div class="zoom-controls">
          <button class="tool-btn" @click.stop="zoomOut" title="缩小 (可使用滚轮下滚)">
            <span class="icon">➖</span>
          </button>
          <span class="zoom-level-text" title="当前缩放比率">{{ Math.round(scale * 100) }}%</span>
          <button class="tool-btn" @click.stop="zoomIn" title="放大 (可使用滚轮上滚)">
            <span class="icon">➕</span>
          </button>
          <button class="tool-btn" @click.stop="resetFit" title="自适应窗口大小">
            <span class="icon">🎯</span> 适应
          </button>
          <button class="tool-btn" @click.stop="resetOriginal" title="1:1 原始高清尺寸">
            <span class="icon">📐</span> 1:1
          </button>
        </div>

        <!-- 全屏沉浸式画板切换 -->
        <button class="tool-btn fullscreen-btn" @click.stop="toggleFullscreen" :title="isFullscreen ? '退出全屏 (Esc)' : '进入全屏高清画板模式'">
          <span class="icon">{{ isFullscreen ? '🗗' : '⛶' }}</span>
          <span>{{ isFullscreen ? '退出全屏' : '全屏画板' }}</span>
        </button>

        <!-- 下载源文件备用 -->
        <a 
          v-if="downloadSrc"
          :href="downloadSrc" 
          :download="fileName || `${title}.xmind`" 
          class="tool-btn download-link"
          title="下载 .xmind 源文件到本地"
          @click.stop
        >
          <span class="icon">⬇️</span>
          <span>源文件</span>
        </a>
      </div>
    </div>

    <!-- 交互式可平移、可缩放画板画布 -->
    <div 
      class="canvas-viewport" 
      ref="viewportRef"
      :class="{ 'is-dragging': isDragging, 'is-fullscreen-view': isFullscreen }"
      @wheel.prevent="handleWheel"
      @mousedown="startDrag"
      @mousemove="onDrag"
      @mouseup="stopDrag"
      @mouseleave="stopDrag"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      @dblclick="handleDoubleClick"
    >
      <div 
        class="canvas-plane" 
        :style="{
          transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
          transition: isDragging ? 'none' : 'transform 0.15s cubic-bezier(0.2, 0, 0, 1)'
        }"
      >
        <img 
          :src="imgSrc" 
          :alt="title" 
          class="highres-map-img" 
          draggable="false"
          @load="onImageLoaded"
        />
      </div>

      <!-- 操作小贴士 -->
      <div class="canvas-hints" v-if="!hasInteracted">
        <span class="hint-pill">🖱️ 鼠标滚轮自由缩放 · 按住左键拖拽平移 · 双击自适应</span>
      </div>

      <!-- 全屏模式关闭浮动按钮 -->
      <button class="modal-close-btn" v-if="isFullscreen" @click="toggleFullscreen" title="退出全屏 (Esc)">
        ✕
      </button>
    </div>

    <!-- 底部说明与注脚 -->
    <div class="widget-footer" v-if="caption && !isFullscreen">
      <span class="footer-icon">💡</span>
      <span class="footer-desc">{{ caption }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  imgSrc: {
    type: String,
    required: true
  },
  downloadSrc: {
    type: String,
    default: ''
  },
  tag: {
    type: String,
    default: '🧠 XMind 高清导图'
  },
  caption: {
    type: String,
    default: ''
  },
  fileName: {
    type: String,
    default: ''
  },
  fileSize: {
    type: String,
    default: ''
  }
})

const viewportRef = ref(null)
const scale = ref(1)
const translateX = ref(0)
const translateY = ref(0)
const isDragging = ref(false)
const dragStartX = ref(0)
const dragStartY = ref(0)
const isFullscreen = ref(false)
const hasInteracted = ref(false)

// 双指触控记录
let lastTouchDistance = 0

function onImageLoaded() {
  resetFit()
}

function zoomIn() {
  hasInteracted.value = true
  scale.value = Math.min(scale.value * 1.25, 4.5)
}

function zoomOut() {
  hasInteracted.value = true
  scale.value = Math.max(scale.value / 1.25, 0.2)
}

function resetFit() {
  scale.value = 1
  translateX.value = 0
  translateY.value = 0
}

function resetOriginal() {
  hasInteracted.value = true
  scale.value = 1.4
  translateX.value = 0
  translateY.value = 0
}

function handleWheel(e) {
  hasInteracted.value = true
  const delta = e.deltaY < 0 ? 1.15 : 0.87
  const newScale = Math.min(Math.max(scale.value * delta, 0.25), 4.5)
  scale.value = newScale
}

function startDrag(e) {
  hasInteracted.value = true
  isDragging.value = true
  dragStartX.value = e.clientX - translateX.value
  dragStartY.value = e.clientY - translateY.value
}

function onDrag(e) {
  if (!isDragging.value) return
  translateX.value = e.clientX - dragStartX.value
  translateY.value = e.clientY - dragStartY.value
}

function stopDrag() {
  isDragging.value = false
}

function handleDoubleClick() {
  if (scale.value > 1.1) {
    resetFit()
  } else {
    scale.value = 1.6
  }
}

// 触摸事件支持 (手机/平板移动端)
function handleTouchStart(e) {
  hasInteracted.value = true
  if (e.touches.length === 1) {
    isDragging.value = true
    dragStartX.value = e.touches[0].clientX - translateX.value
    dragStartY.value = e.touches[0].clientY - translateY.value
  } else if (e.touches.length === 2) {
    isDragging.value = false
    lastTouchDistance = getDistance(e.touches[0], e.touches[1])
  }
}

function handleTouchMove(e) {
  if (e.touches.length === 1 && isDragging.value) {
    translateX.value = e.touches[0].clientX - dragStartX.value
    translateY.value = e.touches[0].clientY - dragStartY.value
  } else if (e.touches.length === 2) {
    const dist = getDistance(e.touches[0], e.touches[1])
    if (lastTouchDistance > 0) {
      const delta = dist / lastTouchDistance
      scale.value = Math.min(Math.max(scale.value * delta, 0.3), 4.0)
    }
    lastTouchDistance = dist
  }
}

function handleTouchEnd() {
  isDragging.value = false
  lastTouchDistance = 0
}

function getDistance(t1, t2) {
  return Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY)
}

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
  if (isFullscreen.value) {
    document.body.style.overflow = 'hidden'
    setTimeout(resetFit, 50)
  } else {
    document.body.style.overflow = ''
    setTimeout(resetFit, 50)
  }
}

function handleKeyDown(e) {
  if (e.key === 'Escape' && isFullscreen.value) {
    toggleFullscreen()
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeyDown)
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.mindmap-widget {
  margin: 24px 0;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.25s ease;
}

.mindmap-widget:hover {
  border-color: var(--vp-c-brand-1);
}

/* 全屏沉浸模式 */
.mindmap-widget.is-fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 9999 !important;
  margin: 0 !important;
  border-radius: 0 !important;
  background: var(--vp-c-bg) !important;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px 16px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
  z-index: 10;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.widget-tag {
  font-size: 11.5px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 9999px;
  background: rgba(139, 92, 246, 0.12);
  color: #7c3aed;
  border: 1px solid rgba(139, 92, 246, 0.25);
}

.dark .widget-tag {
  color: #a78bfa;
}

.widget-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--vp-c-text-1);
  margin: 0;
  border: none;
  padding: 0;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.zoom-controls {
  display: inline-flex;
  align-items: center;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 2px;
  gap: 2px;
}

.tool-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 700;
  border: none;
  background: transparent;
  color: var(--vp-c-text-1);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
}

.tool-btn:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-brand-1);
}

.zoom-level-text {
  font-size: 11.5px;
  font-weight: 800;
  color: var(--vp-c-text-2);
  min-width: 44px;
  text-align: center;
  font-family: var(--vp-font-family-mono);
}

.fullscreen-btn {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border: 1px solid var(--vp-c-brand-border, rgba(59, 130, 246, 0.3));
}

.fullscreen-btn:hover {
  background: var(--vp-c-brand-1);
  color: #ffffff;
}

.download-link {
  text-decoration: none !important;
  color: var(--vp-c-text-3);
  border: 1px solid var(--vp-c-divider);
}

.download-link:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
}

/* 画布视口 */
.canvas-viewport {
  position: relative;
  width: 100%;
  height: 520px;
  background: var(--vp-c-bg-alt);
  overflow: hidden;
  cursor: grab;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.canvas-viewport.is-fullscreen-view {
  height: calc(100vh - 56px) !important;
}

.canvas-viewport.is-dragging {
  cursor: grabbing !important;
}

.canvas-plane {
  will-change: transform;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  max-height: 100%;
  pointer-events: none;
}

.highres-map-img {
  max-width: 100%;
  max-height: 500px;
  height: auto;
  object-fit: contain;
  border-radius: 6px;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.08));
}

.is-fullscreen-view .highres-map-img {
  max-height: calc(100vh - 80px);
}

.canvas-hints {
  position: absolute;
  bottom: 12px;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.hint-pill {
  background: rgba(0, 0, 0, 0.65);
  color: #ffffff;
  padding: 5px 14px;
  border-radius: 9999px;
  font-size: 11.5px;
  font-weight: 600;
  backdrop-filter: blur(6px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.modal-close-btn {
  position: absolute;
  top: 14px;
  right: 18px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-1);
  font-size: 16px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--card-shadow);
  transition: all 0.2s ease;
  z-index: 50;
}

.modal-close-btn:hover {
  background: #ef4444;
  color: #ffffff;
  border-color: #ef4444;
}

.widget-footer {
  padding: 8px 16px 10px 16px;
  background: var(--vp-c-bg-soft);
  border-top: 1px solid var(--vp-c-divider);
  font-size: 12.5px;
  color: var(--vp-c-text-2);
  display: flex;
  align-items: center;
  gap: 6px;
}

@media (max-width: 640px) {
  .canvas-viewport {
    height: 360px;
  }
  .toolbar-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
