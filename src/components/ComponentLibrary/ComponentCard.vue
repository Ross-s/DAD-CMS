<script lang="ts" setup>
import { Card } from "primevue";
import type { ComponentDefinition, MiniComponentDefinition } from "./components";
import { useTemplateRef } from "vue";

const props = defineProps<{
  componentItem: ComponentDefinition;
}>();

const componentRef = useTemplateRef<HTMLDivElement>("componentRef");


function onDragStart(event: DragEvent) {
  event.dataTransfer?.setData(
    "MiniComponentDefinition",
    JSON.stringify({
      type: props.componentItem.type,
      version: props.componentItem.version,
    } as MiniComponentDefinition)
  );
  event.dataTransfer!.effectAllowed = "copy";
}
</script>

<template>
  <div ref="componentRef" @dragstart="onDragStart" draggable="true">
    <Card class="component-item">
      <template #content>
        <div class="component-content">
          <span class="component-icon">{{ props.componentItem.icon }}</span>
          <div class="component-details">
            <span class="component-name">{{ props.componentItem.name }}</span>
            <span class="component-description">{{
              props.componentItem.description
            }}</span>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
<style scoped>
.component-item {
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--p-content-border-color);
}

.component-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--p-card-shadow);
  border-color: var(--p-primary-color);
}

:deep(.p-card-content) {
  padding: 0.75rem;
}

.component-content {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.component-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.component-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.component-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--p-text-color);
  line-height: 1.2;
}

.component-description {
  font-size: 0.75rem;
  color: var(--p-text-muted-color);
  line-height: 1.3;
  white-space: normal;
  word-wrap: break-word;
}
</style>
