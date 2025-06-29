<script lang="ts" setup>
import { useContentStore } from "../stores/contentStore";
import Panel from "primevue/panel";
import DropZone from "./DropZone.vue";
import PreviewWrapper from "./PreviewWrapper.vue";

const contentStore = useContentStore();
</script>

<template>
  <Panel header="Page Content" :toggleable="false" class="content-panel">
    <template #header>
      <div class="panel-header-content">
        <span>Page Content</span>
      </div>
    </template>
    <div class="content-area">
      <div v-if="contentStore.document.length == 0">
        <DropZone :component-id="null" :number-of-children="0" />
      </div>
      <div v-else>
        <PreviewWrapper
          v-for="(component, index) in contentStore.document"
          :key="component.id + 'Wrrapper'"
          :component="component"
          :componentPath="[index]"
        />
        <DropZone :component-id="null" :number-of-children="contentStore.document.length"/>
      </div>
    </div>
  </Panel>
</template>

<style scoped>
.main-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.content-panel {
  height: 100%;
  overflow: hidden;
}

:deep(.p-panel-content) {
  padding: 0;
  height: calc(100vh - 4rem);
  overflow-y: auto;
}

.panel-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.content-area {
  flex: 1;
  padding: 1rem;
  min-height: 400px;
  border: 2px dashed var(--p-content-border-color);
  border-radius: var(--p-border-radius);
  margin: 1rem;
  transition: all 0.3s ease;
}
</style>
