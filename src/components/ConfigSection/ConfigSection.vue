<script lang="ts" setup>
import { computed } from "vue";
import { useContentStore } from "../stores/contentStore";
import { isEmptyOrSpaces } from "../../lib/utils";

const contentStore = useContentStore();
const component = computed(() => contentStore.activeComponent.component);
const componentDefinition = computed(() => contentStore.findComponentByTypeAndVersion(
  component.value?.type!,
  component.value?.version!
));

const hasInternalName = computed(() => 
  !isEmptyOrSpaces(component.value?.internaleName)
);

console.log(contentStore.activeComponent);
</script>
<template>
  <div class="config-wrapper">
    <div class="config-header">
      <h3 v-if="component === null">Settings</h3>
      <h3 v-if="component !== null && !hasInternalName">Settings - {{ componentDefinition?.name }}</h3>
      <h3 v-else>Settings - {{ componentDefinition?.name }} - {{ component?.internaleName }}</h3>
    </div>
    <div v-if="contentStore.activeComponent.component === null">
      <div class="config-content">
        <div class="select-component-container">
          <div class="select-component-icon">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 12L11 14L15 10"
                stroke="#9CA3AF"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="#9CA3AF"
                stroke-width="2"
              />
            </svg>
          </div>
          <h4 class="select-component-title">Select a Component</h4>
          <p class="select-component-text">
            Choose a component from the content area to configure its settings
            and properties.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.config-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}
.config-header {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 6px 6px 0 0;
  flex-shrink: 0;
}

.config-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.config-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.select-component-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 300px;
}

.select-component-icon {
  margin-bottom: 1rem;
  opacity: 0.6;
}

.select-component-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
}

.select-component-text {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
}
</style>
