<template>
  <div class="article-share">
    <button
      class="article-share__button"
      :class="{ copied }"
      :aria-label="copied ? '已复制!' : '分享链接'"
      @click="copyLink"
    >
      <div class="content-wrapper">
        <span class="icon">
          <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
            <polyline points="16 6 12 2 8 6"></polyline>
            <line x1="12" y1="2" x2="12" y2="15"></line>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 6 9 17l-5-5"></path>
          </svg>
        </span>
        {{ copied ? '已复制!' : '分享链接' }}
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const copied = ref(false)

function copyLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  })
}
</script>

<style scoped>
.article-share {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 12px;
}

.article-share__button {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 14px;
  padding: 7px 14px;
  width: 100%;
  overflow: hidden;
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-bg-alt);
  box-shadow: 0 2px 5px rgba(0,0,0,0.02);
  transition: background-color 0.15s, border-color 0.15s, color 0.15s;
}

.article-share__button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 0;
  background-color: var(--vp-c-brand-1);
  opacity: 0.15;
  border-radius: 14px;
  transition: width 0.6s cubic-bezier(0.33, 1, 0.68, 1);
}

.article-share__button.copied::before {
  width: 100%;
}

.article-share__button:hover {
  background-color: var(--vp-c-brand-soft);
  border-color: var(--vp-c-gutter);
}

.article-share__button.copied {
  color: var(--vp-c-brand-1);
  background-color: var(--vp-c-brand-soft);
}

.content-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
}

.icon {
  display: flex;
  align-items: center;
}
</style>
