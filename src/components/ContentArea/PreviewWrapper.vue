<script setup lang="ts">
import type {
  Component,
  MiniComponentMetadata,
} from "../ComponentLibrary/components";
import Card from "primevue/card";
import Button from "primevue/button";
import { useContentStore } from "../stores/contentStore";
import TextPreview from "./Previews/TextPreview.vue";
import { ref } from "vue";
import ContainerPreview from "./Previews/ContainerPreview.vue";

const props = defineProps<{
  component: Component;
}>();

const contentStore = useContentStore();

const componentDefinition = contentStore.findComponentByTypeAndVersion(
  props.component.type!,
  props.component.version!
);

const handleDelete = () => {
  contentStore.deleteComponent(props.component.id!);
};

const isDraggingOverTop = ref(false);

function onDragOverTop(event: DragEvent) {
  event.preventDefault();
  if (event.dataTransfer?.effectAllowed == "copy") {
    event.dataTransfer!.dropEffect = "copy";
  } else {
    event.dataTransfer!.dropEffect = "move";
  }
  isDraggingOverTop.value = true;
}

function onDragLeave(event: DragEvent) {
  event.preventDefault();
  isDraggingOverTop.value = false;
}

function onDropOverTop(event: DragEvent) {
  event.preventDefault();
  isDraggingOverTop.value = false;

  if (event.dataTransfer?.effectAllowed === "copy") {
    const data = event.dataTransfer!.getData("MiniComponentMetadata");
    const component = JSON.parse(data) as MiniComponentMetadata;
    contentStore.addComponent(component, {
        componentId: props.component.id!,
        insertionPosition: "before",
        type: "sibling",
    });
  }

  if (event.dataTransfer?.effectAllowed !== "copy") {
    const componentId = event.dataTransfer!.getData("ComponentId");
    contentStore.moveComponent(componentId, {
        componentId: props.component.id!,
        insertionPosition: "before",
        type: "sibling",
    });
  }
}

function onDragStart(event: DragEvent) {
  event.dataTransfer?.setData(
    "ComponentId",
    props.component.id!
  );
  event.dataTransfer!.effectAllowed = "move";
  hideComponent.value = true;
}

function onDragEnd(event: DragEvent) {
  event.preventDefault();
  hideComponent.value = false;
}

const hideComponent = ref(false);
</script>

<template>
  <Card class="w-full" :style="{ opacity: hideComponent ? 0.5 : 1 }">
    <template #header>
      <div
        @dragleave="onDragLeave"
        @drop="onDropOverTop"
        @dragover="onDragOverTop"
        draggable="true"
        @dragstart="onDragStart"
        @dragend="onDragEnd"
      >
        <div v-if="isDraggingOverTop" class="drag-above"></div>
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: #fafbfc;
            border-bottom: 1px solid #e1e5e9;
            /* margin: -1rem -1rem 0 -1rem; */
            padding: 0.75rem 1rem;
          "
        >
          <h3
            class="m-0"
            style="color: #374151; font-weight: 500; font-size: 1rem"
          >
            {{ componentDefinition?.name }} - {{ component.id }}
          </h3>
          <Button
            severity="danger"
            size="small"
            outlined
            @click="handleDelete"
            aria-label="Delete component"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </Button>
        </div>
      </div>
    </template>

    <template #content>
      <div style="padding: 0.1rem">
        <TextPreview
          v-if="componentDefinition?.type === 'text'"
          :component="component"
        />
        <ContainerPreview
          v-if="componentDefinition?.type == 'container'"
          :component="component"
        />
      </div>
    </template>
  </Card>
</template>

<style scoped>
.drag-above {
  border-top: 2px solid var(--p-primary-color);
  background-color: var(--p-primary-color-light);
}
</style>
