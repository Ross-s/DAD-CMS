<script lang="ts" setup>
import Splitter from "primevue/splitter";
import SplitterPanel from "primevue/splitterpanel";
import ComponentsView from "./ComponentLibrary/ComponentsView.vue";
import ContentArea from "./ContentArea/ContentArea.vue";
import ComponentTree from "./ComponentTree/ComponentTree.vue";
import ConfigSection from "./ConfigSection/ConfigSection.vue";
</script>

<template>
  <Splitter style="height: 100vh">
    <SplitterPanel
      class="flex items-center justify-center"
      :size="25"
      :minSize="20"
      style="max-width: 450px"
    >
      <Splitter layout="vertical" style="height: 100%; width: 100%">
        <SplitterPanel :size="67" :minSize="50">
          <ComponentsView />
        </SplitterPanel>
        <SplitterPanel :size="33" :minSize="20">
          <ComponentTree />
        </SplitterPanel>
      </Splitter>
    </SplitterPanel>
    <SplitterPanel
      class="flex items-center justify-center"
      :size="60"
      :minSize="40"
    >
      <ContentArea />
    </SplitterPanel>
    <SplitterPanel class="flex items-center justify-center">
      <ConfigSection />
    </SplitterPanel>
  </Splitter>
</template>
