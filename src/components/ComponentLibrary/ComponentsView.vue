<script lang="ts" setup>
import { useContentStore } from "../stores/contentStore";
import ComponentCard from "./ComponentCard.vue";

const contentStore = useContentStore();
</script>

<template>
  <div class="components-wrapper">
    <div class="components-header">
      <h3>Component Library</h3>
    </div>
    <div class="components-scroll-container">
      <div class="component-list">
        <div v-for="component in contentStore.components" :key="component.name">
          <ComponentCard :component-item="component" v-if="component.hideFromUI !== true" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.components-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.components-header {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 6px 6px 0 0;
  flex-shrink: 0;
}

.components-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.components-scroll-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0.75rem;
  min-height: 0;
}

.component-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
