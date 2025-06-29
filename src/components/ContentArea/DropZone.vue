<script lang="ts" setup>
import type { Component, MiniComponentMetadata } from "../ComponentLibrary/components";
import { useContentStore } from "../stores/contentStore";

const props = defineProps<{
  componentId: string | null;
  numberOfChildren: number;
}>();

const contentStore = useContentStore();

function onDragOver(event: DragEvent) {
  event.preventDefault();
  if (event.dataTransfer?.effectAllowed === "copy") {
    event.dataTransfer!.dropEffect = "copy";
  } else {
    event.dataTransfer!.dropEffect = "move";
  }
}

function onDrop(event: DragEvent) {
  event.preventDefault();
  if (event.dataTransfer?.effectAllowed === "copy") {
    const data = event.dataTransfer!.getData("MiniComponentMetadata");
    const component = JSON.parse(data) as MiniComponentMetadata;
    contentStore.addComponent(component, {
        componentId: props.componentId,
        insertionPosition: props.numberOfChildren,
        type: "parent"
    });
  }

  if (event.dataTransfer?.effectAllowed !== "copy") {
    const componentId = event.dataTransfer!.getData("ComponentId");
    contentStore.moveComponent(componentId, {
        componentId: props.componentId,
        insertionPosition: props.numberOfChildren,
        type: "parent"
    });
  }
}
</script>

<template>
  <div class="drop-zone" @dragover="onDragOver" @drop="onDrop">
    <div class="drop-zone__content">
      <div class="drop-zone__icon">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7,10 12,15 17,10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </div>
      <p class="drop-zone__text">Drop components here</p>
    </div>
  </div>
</template>
<style scoped>
.drop-zone {
  min-height: 200px;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  background-color: #f9fafb;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.drop-zone:hover {
  border-color: #9ca3af;
  background-color: #f3f4f6;
}

.drop-zone--active {
  border-color: #3b82f6;
  background-color: #eff6ff;
  border-style: solid;
}

.drop-zone__content {
  text-align: center;
  color: #6b7280;
}

.drop-zone--active .drop-zone__content {
  color: #3b82f6;
}

.drop-zone__icon {
  margin-bottom: 12px;
  opacity: 0.6;
}

.drop-zone--active .drop-zone__icon {
  opacity: 1;
}

.drop-zone__text {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.drop-zone::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 6px;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(59, 130, 246, 0.1) 50%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.drop-zone--active::before {
  opacity: 1;
}
</style>
