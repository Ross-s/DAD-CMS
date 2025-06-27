<script lang="ts" setup>
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import ComponentsView from './ComponentLibrary/ComponentsView.vue';
</script>

<template>
    <Splitter style="height: 100vh">
    <SplitterPanel class="flex items-center justify-center" :size="20" :minSize="15" style="max-width: 350px"> <ComponentsView /> </SplitterPanel>
    <SplitterPanel class="flex items-center justify-center" :size="60" :minSize="40"> Panel 2 </SplitterPanel>
    <SplitterPanel class="flex items-center justify-center"> Panel 3 </SplitterPanel>
</Splitter>
</template>