<script lang="ts" setup>
import { useContentStore } from "../stores/contentStore";
import ComponentCard from "./ComponentCard.vue";
import Panel from "primevue/panel";

const contentStore = useContentStore();
</script>

<template>
  <Panel header="Component Library" :toggleable="false" class="sidebar-panel">
    <div class="component-list">
      <ComponentCard
        v-for="component in contentStore.components"
        :component-item="component"
        :key="component.name"
      />
    </div>
  </Panel>
</template>

<style scoped>
.sidebar-panel {
  height: 100%;
  overflow: hidden;
}

:deep(.p-panel-content) {
  padding: 0.75rem;
  height: calc(100vh - 4rem);
  overflow-y: auto;
}

:deep(.p-panel-header) {
  border-bottom: 1px solid var(--p-panel-header-border-color);
}

.component-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
