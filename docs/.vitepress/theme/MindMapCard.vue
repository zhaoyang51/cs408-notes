<template>
  <div class="mindmap-card">
    <!-- 头部信息 -->
    <div class="mindmap-header">
      <div class="header-left">
        <span class="mindmap-tag">{{ tag }}</span>
        <h3 class="mindmap-title">{{ title }}</h3>
      </div>
      <div class="header-actions" v-if="downloadSrc">
        <a 
          :href="downloadSrc" 
          :download="fileName || `${title}.xmind`" 
          class="download-btn"
          title="下载 XMind 原源文件到本地"
        >
          <span class="btn-icon">⬇️</span>
          <span>下载 .xmind 源文件</span>
          <span class="file-size-badge" v-if="fileSize">{{ fileSize }}</span>
        </a>
      </div>
    </div>

    <!-- 导图主体预览区 -->
    <div class="mindmap-body" @click="toggleZoom">
      <div class="img-container" :class="{ 'is-zoomed': isZoomed }">
        <img 
          :src="imgSrc" 
          :alt="title" 
          class="mindmap-img" 
          loading="lazy"
          :title="isZoomed ? '点击还原大小' : '点击放大查看'"
        />
        <div class="zoom-hint">
          <span>{{ isZoomed ? '🔍 点击缩小' : '🔍 点击可放大全屏预览' }}</span>
        </div>
      </div>
    </div>

    <!-- 底部描述与说明 -->
    <div class="mindmap-footer" v-if="caption">
      <span class="footer-icon">💡</span>
      <span class="footer-desc">{{ caption }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

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
    default: '🧠 XMind 思维导图'
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

const isZoomed = ref(false)

function toggleZoom() {
  isZoomed.value = !isZoomed.value
}
</script>

<style scoped>
.mindmap-card {
  margin: 24px 0;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  overflow: hidden;
  transition: all 0.25s ease;
}

.mindmap-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--card-hover-shadow);
}

.mindmap-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  padding: 12px 18px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mindmap-tag {
  font-size: 11.5px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 9999px;
  background: rgba(139, 92, 246, 0.12);
  color: #7c3aed;
  border: 1px solid rgba(139, 92, 246, 0.25);
}

.dark .mindmap-tag {
  color: #a78bfa;
}

.mindmap-title {
  font-size: 15.5px;
  font-weight: 800;
  color: var(--vp-c-text-1);
  margin: 0;
  border: none;
  padding: 0;
}

.download-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 700;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border: 1px solid var(--vp-c-brand-border, rgba(59, 130, 246, 0.3));
  text-decoration: none !important;
  transition: all 0.2s ease;
}

.download-btn:hover {
  background: var(--vp-c-brand-1);
  color: #ffffff !important;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
}

.file-size-badge {
  font-size: 10.5px;
  opacity: 0.8;
  padding: 1px 5px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.08);
}

.dark .file-size-badge {
  background: rgba(255, 255, 255, 0.15);
}

.mindmap-body {
  padding: 16px;
  background: var(--vp-c-bg);
  cursor: zoom-in;
  display: flex;
  justify-content: center;
}

.img-container {
  position: relative;
  width: 100%;
  max-height: 480px;
  overflow: hidden;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  transition: max-height 0.3s ease;
}

.img-container.is-zoomed {
  max-height: none;
  cursor: zoom-out;
}

.mindmap-img {
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 6px;
  transition: transform 0.25s ease;
}

.zoom-hint {
  position: absolute;
  bottom: 8px;
  right: 12px;
  background: rgba(0, 0, 0, 0.65);
  color: #ffffff;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 11.5px;
  font-weight: 600;
  backdrop-filter: blur(4px);
  pointer-events: none;
}

.mindmap-footer {
  padding: 10px 18px;
  background: var(--vp-c-bg-soft);
  border-top: 1px solid var(--vp-c-divider);
  font-size: 13px;
  color: var(--vp-c-text-2);
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer-icon {
  font-size: 15px;
}
</style>
