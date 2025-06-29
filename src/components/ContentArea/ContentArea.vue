<script lang="ts" setup>
import { useContentStore } from "../stores/contentStore";
import DropZone from "./DropZone.vue";
import PreviewWrapper from "./PreviewWrapper.vue";
import { watch } from "vue";

const contentStore = useContentStore();

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
      <h3>Page Content</h3>
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

.content-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
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
