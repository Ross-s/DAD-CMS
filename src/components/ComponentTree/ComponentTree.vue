<script lang="ts" setup>
import { computed, ref, watch, nextTick } from "vue";
import { useContentStore } from "../stores/contentStore";
import type { Component } from "../ComponentLibrary/components";
import Tree from "primevue/tree";

interface TreeNode {
  key: string;
  label: string;
  icon?: string;
  data: Component;
  children?: TreeNode[];
}

const contentStore = useContentStore();
const treeRef = ref();

const documentTree = computed(() => contentStore.document);
const selectedKeys = ref<Record<string, boolean>>({});
const expandedKeys = ref<Record<string, boolean>>({});

const buildPrimeTreeNodes = (components: Component[]): TreeNode[] => {
  return components.map((component) => {
    const componentDef = contentStore.findComponentByTypeAndVersion(
      component.type || "",
      component.version || ""
    );

    return {
      key: component.id || "",
      label: componentDef?.name || component.type || "Unknown",
      icon: componentDef?.icon || "📦",
      data: component,
      children: component.children
        ? buildPrimeTreeNodes(component.children)
        : undefined,
    };
  });
};

const treeNodes = computed(() => buildPrimeTreeNodes(documentTree.value));

const onNodeSelect = (node: any) => {
  if (node.data) {
    contentStore.setActiveComponent(node.data as Component, "tree");
  }
};

// Function to find all parent keys for a given component ID
const findParentKeys = (
  targetId: string,
  nodes: TreeNode[],
  parentKeys: string[] = []
): string[] | null => {
  for (const node of nodes) {
    if (node.key === targetId) {
      return parentKeys;
    }

    if (node.children) {
      const result = findParentKeys(targetId, node.children, [
        ...parentKeys,
        node.key,
      ]);
      if (result !== null) {
        return result;
      }
    }
  }
  return null;
};

// Function to expand all parent nodes of the active component
const expandToActiveComponent = (activeId: string) => {
  const parentKeys = findParentKeys(activeId, treeNodes.value);
  if (parentKeys) {
    const newExpandedKeys: Record<string, boolean> = { ...expandedKeys.value };
    parentKeys.forEach((key) => {
      newExpandedKeys[key] = true;
    });
    expandedKeys.value = newExpandedKeys;
  }
};

// Watch for active component changes and update selected keys + expand tree
watch(
  () => contentStore.activeComponent,
  async (newActive) => {
    selectedKeys.value = {};
    if (newActive.component?.id) {
      selectedKeys.value[newActive.component.id] = true;
      expandToActiveComponent(newActive.component.id);

      // Scroll to the selected node after the DOM updates
      await nextTick();
      if (treeRef.value && newActive.setBy === "contentArea") {
        const selectedElement = treeRef.value.$el.querySelector(
          ".p-tree-node-selected"
        );
        if (selectedElement) {
          // Find the scrollable container (.tree-scroll-container)
          const scrollContainer = selectedElement.closest(
            ".tree-scroll-container"
          );
          if (scrollContainer) {
            const containerRect = scrollContainer.getBoundingClientRect();
            const elementRect = selectedElement.getBoundingClientRect();
            const scrollTop = scrollContainer.scrollTop;
            const targetScroll =
              scrollTop +
              elementRect.top -
              containerRect.top -
              containerRect.height / 2 +
              elementRect.height / 2;

            scrollContainer.scrollTo({
              top: Math.max(0, targetScroll),
              behavior: "smooth",
            });
          }
        }
      }
    }
  },
  { immediate: true }
);

// Auto-expand all nodes on initial load
watch(
  treeNodes,
  (newNodes) => {
    if (newNodes.length > 0) {
      const autoExpandKeys: Record<string, boolean> = {};
      const expandAllNodes = (nodes: TreeNode[]) => {
        nodes.forEach((node) => {
          if (node.children && node.children.length > 0) {
            autoExpandKeys[node.key] = true;
            expandAllNodes(node.children);
          }
        });
      };
      expandAllNodes(newNodes);
      expandedKeys.value = { ...expandedKeys.value, ...autoExpandKeys };
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="tree-wrapper">
    <div class="tree-header">
      <h3>Component Tree</h3>
      <div class="debug-info">
        Document components: {{ documentTree.length }} | Tree nodes:
        {{ treeNodes.length }}
      </div>
    </div>

    <div class="tree-body">
      <div v-if="treeNodes.length === 0" class="empty-state">
        <p>No components in the document</p>
        <p class="empty-subtext">
          Drag components from the library to get started
        </p>
      </div>

      <div v-else class="tree-scroll-container">
        <Tree
          ref="treeRef"
          :value="treeNodes"
          v-model:selectionKeys="selectedKeys"
          v-model:expandedKeys="expandedKeys"
          selectionMode="single"
          @node-select="onNodeSelect"
          class="component-tree"
        >
          <template #default="slotProps">
            <span class="tree-node-content">
              <span class="component-icon">{{ slotProps.node.icon }}</span>
              <span class="component-name">{{ slotProps.node.label }}</span>
            </span>
          </template>
        </Tree>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tree-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.tree-header {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 6px 6px 0 0;
  flex-shrink: 0;
}

.tree-header h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.debug-info {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

.tree-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.empty-state {
  color: #6b7280;
  text-align: center;
  padding: 2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.empty-subtext {
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.tree-scroll-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0.5rem;
  /* Force a specific height for testing */
  max-height: 300px;
}

.component-tree {
  /* Let the tree expand naturally */
}

.tree-node-content {
  display: flex;
  align-items: center;
  width: 100%;
}

.component-icon {
  margin-right: 8px;
  font-size: 1rem;
}

.component-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.component-id {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-left: 8px;
  background-color: #f3f4f6;
  padding: 2px 6px;
  border-radius: 3px;
}

:deep(.p-tree .p-tree-node-content) {
  padding: 0.25rem 0.5rem;
}

:deep(.p-tree .p-tree-node-content:hover) {
  background-color: var(--p-tree-node-hover-background);
}

:deep(
    .p-tree .p-tree-node-content.p-tree-node-selectable.p-tree-node-selected
  ) {
  background-color: var(--p-tree-node-selected-background);
  color: var(--p-tree-node-selected-color);
}
</style>
