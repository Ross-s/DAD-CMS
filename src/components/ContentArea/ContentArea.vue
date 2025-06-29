<script lang="ts" setup>
import { useContentStore } from "../stores/contentStore";
import { useHistoryStore } from "../stores/historyStore";
import DropZone from "./DropZone.vue";
import PreviewWrapper from "./PreviewWrapper.vue";
import { watch } from "vue";

const contentStore = useContentStore();
const historyStore = useHistoryStore();

watch(
  () => contentStore.activeComponent,
  (activeComponent) => {
    if (activeComponent.setBy === "tree") {
      document.getElementById(activeComponent.component?.id!)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }
);
</script>

<template>
  <div class="content-wrapper">
    <div class="content-header">
      <div class="header-content">
        <h3>Page Content</h3>
        <div class="action-buttons">
          <Button class="action-btn" title="Undo" :disabled="!historyStore.canUndo" @click="historyStore.undo">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 7v6h6"/>
              <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
            </svg>
          </button>
          <Button class="action-btn" title="Redo" :disabled="!historyStore.canRedo" @click="historyStore.redo">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 7v6h-6"/>
              <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div class="content-body">
      <div class="content-area">
        <div v-if="contentStore.document.length == 0">
          <DropZone :component-id="null" :number-of-children="0" />
        </div>
        <div v-else>
          <PreviewWrapper
            v-for="component in contentStore.document"
            :key="component.id + 'Wrrapper'"
            :component="component"
          />
          <DropZone
            :component-id="null"
            :number-of-children="contentStore.document.length"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.content-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.content-header {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 6px 6px 0 0;
  flex-shrink: 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6b7280;
}

.action-btn:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #9ca3af;
  color: #374151;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.content-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.content-area {
  flex: 1;
  padding: 1rem;
  min-height: 400px;
  border: 2px dashed var(--p-content-border-color);
  border-radius: var(--p-border-radius);
  margin: 1rem;
  transition: all 0.3s ease;
  overflow-y: auto;
}
</style>
