<script setup lang="ts">
import type { Component } from '../../ComponentLibrary/components';
import { useContentStore } from '../../stores/contentStore';

const props = defineProps<{
    component: Component
}>();
</script>

<template>
    <p>{{ props.component?.config?.text }}</p>
</template>