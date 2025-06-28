<script setup lang="ts">
import type { Component } from '../../ComponentLibrary/components';
import { useContentStore } from '../../stores/contentStore';

const props = defineProps<{
    component: Component
}>();

const contentStore = useContentStore();

const componentDefinition = contentStore.findComponentByTypeAndVersion(
    props.component.type!,
    props.component.version!
);


</script>

<template>
    <p>{{ component?.config?.text }}</p>
</template>