<script setup lang="ts">
import type { Component } from "../../ComponentLibrary/components";
import { ref, computed, watch } from "vue";
import PreviewWrapper from "../PreviewWrapper.vue";
import DropZone from "../DropZone.vue";
import { useContentStore } from "../../stores/contentStore";

const props = defineProps<{
  component: Component;
}>();

const contentStore = useContentStore();

const getTabIdForActiveComponent = () => {
  const location = contentStore.findComponentById(
    contentStore.activeComponent.component?.id!
  );

  if (location?.componentIdPath.includes(props.component.id!)) {
    const index = location.componentIdPath.indexOf(props.component.id!);
    if (index !== location.componentIdPath.length - 1) {
      return location.componentIdPath[index + 1];
    }
  }
};

watch(
  () => contentStore.activeComponent.component,
  () => {
    const tabId = getTabIdForActiveComponent();
    if (tabId) {
      activeTabId.value = tabId;
    }
  }
);

const activeTabId = ref<string | null>(
  getTabIdForActiveComponent() || props.component.children?.[0]?.id || null
);

const activeTab = computed(() => {
  return (
    props.component.children?.find((tab) => tab.id === activeTabId.value) ||
    null
  );
});

const tabs = computed(() => {
  return props.component.children || [];
});

const setActiveTab = (tabId: string) => {
  activeTabId.value = tabId;
  contentStore.setActiveComponent(props.component!, "contentArea");
};
</script>

<template>
  <div class="tabs-container">
    <!-- Tab Headers -->
    <div class="tab-headers">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="setActiveTab(tab.id!)"
        :class="['tab-header', { active: tab.id === activeTabId }]"
      >
        {{ tab.config?.title }}
      </button>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      <div v-if="activeTabId">
        <PreviewWrapper
          v-for="child in activeTab?.children || []"
          :key="child.id + 'Wrapper'"
          :component="child"
        />
      </div>
      <DropZone
        :component-id="activeTabId!"
        :number-of-children="activeTab?.children?.length || 0"
      />
    </div>
  </div>
</template>

<style scoped>
.tabs-container {
  width: 100%;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  overflow: hidden;
}

.tab-headers {
  display: flex;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e1e5e9;
}

.tab-header {
  background: none;
  border: none;
  padding: 12px 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #6c757d;
  border-bottom: 3px solid transparent;
  transition: all 0.2s ease;
  position: relative;
}

.tab-header:hover {
  background-color: #e9ecef;
  color: #495057;
}

.tab-header.active {
  color: #0d6efd;
  background-color: #fff;
  border-bottom-color: #0d6efd;
}

.tab-header:not(:last-child) {
  border-right: 1px solid #e1e5e9;
}

.tab-content {
  padding: 16px;
  background-color: #fff;
  min-height: 100px;
}

.empty-tabs {
  text-align: center;
  color: #6c757d;
  font-style: italic;
}
</style>
