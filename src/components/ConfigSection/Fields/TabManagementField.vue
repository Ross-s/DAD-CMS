<script lang="ts" setup>
import type {
  Component,
  ComponentDefinition,
} from "../../ComponentLibrary/components";
import Accordion from "primevue/accordion";
import AccordionPanel from "primevue/accordionpanel";
import AccordionHeader from "primevue/accordionheader";
import AccordionContent from "primevue/accordioncontent";
import Button from "primevue/button";
import TextInputField from "./TextInputField.vue";
import { useContentStore } from "../../stores/contentStore";
import { ref } from "vue";

const props = defineProps<{
  component: Component;
  componentDefinition: ComponentDefinition;
}>();

const hideTab = ref<string | null>(null);
const showDragLine = ref<string | null>(null);

const contentStore = useContentStore();

// Drag handlers
const handleDragStart = (event: DragEvent, tabId: string) => {
  event.dataTransfer!.effectAllowed = "move";
  event.dataTransfer!.setData("text/plain", tabId);
  hideTab.value = tabId;
};

const handleDragOver = (event: DragEvent, tabId: string) => {
  event.preventDefault();
  event.dataTransfer!.dropEffect = "move";
  showDragLine.value = tabId;
};

const handleDrop = (event: DragEvent, tabId: string) => {
  event.preventDefault();

  const draggedTabId = event.dataTransfer!.getData("text/plain");
  if (!draggedTabId || draggedTabId === tabId) {
    return;
  }

  if (tabId === "last") {
    // If dropping on the last position, add to the end
    contentStore.moveComponent(draggedTabId, {
      componentId: props.component.id!,
      insertionPosition: props.component.children?.length || 0,
      type: "parent",
    });
    return;
  }

  contentStore.moveComponent(draggedTabId, {
    componentId: tabId,
    insertionPosition: "before",
    type: "sibling",
  });
};

const handleDragEnd = () => {
  hideTab.value = null;
  showDragLine.value = null;
};

// Add new tab
const addNewTab = () => {
  const componentDefinition = contentStore.findComponentByTypeAndVersion("tab");

  contentStore.addComponent(
    {
      type: componentDefinition?.type!,
      version: componentDefinition?.version!,
    },
    {
      componentId: props.component.id!,
      insertionPosition: props.component.children?.length || 0,
      type: "parent",
    }
  );
};

// Remove tab
const removeTab = (tabId: string) => {
  contentStore.deleteComponent(tabId);
};
</script>
<template>
  <div class="tab-management">
    <div class="tab-management-header">
      <h4>Tabs</h4>
      <button 
        @click="addNewTab" 
        class="add-tab-button"
        title="Add Tab"
      >
        +
      </button>
    </div>

    <div v-if="!props.component.children?.length" class="no-tabs-message">
      <p>No tabs yet. Click "Add Tab" to create your first tab.</p>
    </div>

    <Accordion v-else multiple>
      <AccordionPanel
        v-for="(tab, index) in props.component.children"
        :key="tab.id"
        :value="index"
        @dragover="handleDragOver($event, tab.id!)"
        @drop="handleDrop($event, tab.id!)"
        :style="{
          opacity: hideTab === tab.id ? 0.5 : 1,
          borderTop: showDragLine === tab.id ? '3px solid #3b82f6' : 'none',
        }"
      >
        <AccordionHeader class="draggable-header">
          <div class="accordion-header-content">
            <div
              class="drag-handle"
              draggable="true"
              @dragstart="(event) => handleDragStart(event, tab.id!)"
              @dragend="handleDragEnd"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <circle cx="9" cy="5" r="1" />
                <circle cx="15" cy="5" r="1" />
                <circle cx="9" cy="12" r="1" />
                <circle cx="15" cy="12" r="1" />
                <circle cx="9" cy="19" r="1" />
                <circle cx="15" cy="19" r="1" />
              </svg>
            </div>
            <span class="tab-title">
              {{ tab.config?.title || "Untitled" }}
            </span>
            <Button
              severity="danger"
              size="small"
              outlined
              @click="removeTab(tab.id!)"
              aria-label="Delete component"
              :style="{ marginRight: '15px' }"
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
        </AccordionHeader>
        <AccordionContent>
          <div class="config-field">
            <TextInputField
              :field-settings="{
                type: 'text',
                label: 'Tab Title',
                nullable: false,
                maxLength: 30,
                minLength: 3,
              }"
              :value="tab.config?.title || ''"
              @update:value="(value) => {
                contentStore.updateComponentById(tab.id!, {
                  internalName: value,
                  config: {
                    ...tab.config,
                    title: value,
                  },
                });
              }"
            />
          </div>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
    <div
      :style="{
        borderTop: showDragLine === 'last' ? '3px solid #3b82f6' : 'none',
        height: '100px',
        width: '100%',
      }"
      @dragover="handleDragOver($event, 'last')"
        @drop="handleDrop($event, 'last')"
    ></div>
  </div>
</template>

<style scoped>
.tab-management {
  margin-bottom: 1rem;
}

.tab-management-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.tab-management-header h4 {
  margin: 0;
  color: #374151;
  font-weight: 600;
}

.add-tab-button {
  width: 24px;
  height: 24px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  color: #059669;
  transition: all 0.15s ease;
}

.add-tab-button:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.add-tab-button:active {
  background: #e5e7eb;
}

.no-tabs-message {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  font-style: italic;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  background-color: #f9fafb;
}

.no-tabs-message p {
  margin: 0;
}

.config-field {
  margin-top: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
}

/* Drag and drop styles */
.draggable-header {
  cursor: grab;
  transition: all 0.2s ease;
}

.draggable-header:active {
  cursor: grabbing;
}

.accordion-header-content {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 0.5rem;
}

.drag-handle {
  color: #9ca3af;
  padding: 0.25rem;
  border-radius: 4px;
  transition: color 0.2s ease;
}

.draggable-header:hover .drag-handle {
  color: #6b7280;
}

.tab-title {
  flex: 1;
  text-align: left;
}

.remove-tab-button {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
}

/* Drag states */
:deep(.p-accordion-panel.dragging) {
  opacity: 0.5;
  transform: scale(0.98);
}

:deep(.p-accordion-panel.drag-over) {
  border-top: 3px solid #3b82f6;
  background-color: #eff6ff;
}

/* Accordion customization */
:deep(.p-accordion-header-content) {
  padding: 0.75rem 1rem;
}

:deep(.p-accordion-content) {
  padding: 0 1rem 1rem 1rem;
}

/* Ensure proper spacing for buttons */
:deep(.p-button.p-button-outlined.p-button-sm) {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

/* Disable button styling when disabled */
:deep(.p-button:disabled) {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
