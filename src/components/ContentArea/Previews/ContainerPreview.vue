<script setup lang="ts">
import type { Component } from "../../ComponentLibrary/components";
import DropZone from "../DropZone.vue";
import PreviewWrapper from "../PreviewWrapper.vue";

const props = defineProps<{
  component: Component;
}>();

</script>

<template>
  <div>
    <div v-if="component.children?.length == 0">
      <DropZone :component-id="props.component.id!" :number-of-children="0" />
    </div>
    <div v-else>
        <PreviewWrapper 
          v-for="child in props.component.children"
          :key="child.id + 'Wrapper'"
          :component="child" />
          <DropZone :component-id="props.component.id!" :number-of-children="props.component.children?.length ?? 0" />
    </div>
  </div>
</template>
