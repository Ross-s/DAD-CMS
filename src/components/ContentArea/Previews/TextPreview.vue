<script setup lang="ts">
import type { Component } from '../../ComponentLibrary/components';

const props = defineProps<{
    component: Component
}>();
</script>

<template>
    <p>{{ props.component?.config?.text }}</p>
</template>