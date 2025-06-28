<script setup lang="ts">
import type { Component } from "../../ComponentLibrary/components";
import { useContentStore } from "../../stores/contentStore";
import DropZone from "../DropZone.vue";
import PreviewWrapper from "../PreviewWrapper.vue";

const props = defineProps<{
  component: Component;
  componentPath: number[];
}>();

const contentStore = useContentStore();

const componentDefinition = contentStore.findComponentByTypeAndVersion(
  props.component.type!,
  props.component.version!
);
</script>

<template>
  <div>
    <div v-if="component.children?.length == 0">
      <DropZone :component-path="[...componentPath, 0]" />
    </div>
    <div v-else>
        <PreviewWrapper 
          v-for="(child, index) in component.children"
          :key="index"
          :component="child"
          :componentPath="[...componentPath, index]" />
          <DropZone :component-path="[...componentPath, component?.children?.length!]" />
    </div>
  </div>
</template>
