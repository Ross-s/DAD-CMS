<script lang="ts" setup>
import type {
  Component,
  ComponentDefinition,
} from "../ComponentLibrary/components";
import { useContentStore } from "../stores/contentStore";
import TextInputField from "./Fields/TextInputField.vue";
import SelectInputField from "./Fields/SelectInputField.vue";

const props = defineProps<{
  component: Component;
  componentDefinition: ComponentDefinition;
}>();

const contentStore = useContentStore();

const updateFieldValue = (configFieldName: string, value: any) => {
  contentStore.updateComponentById(props.component.id!, {
    config: {
      ...props.component?.config,
      [configFieldName]: value,
    },
  });
};
</script>

<template>
  <div class="config-content">
    <TextInputField
      :field-settings="{
        type: 'text',
        label: 'Internal Name',
        nullable: true,
        maxLength: 30,
        minLength: 3,
      }"
      :value="props.component?.internaleName!"
      @update:value="(value) =>
            contentStore.updateComponentById(props.component?.id!, {
              internaleName: value,
            })"
    />
  </div>
  <div
    v-for="configFieldName in Object.keys(
      props.componentDefinition?.configFields || {}
    )"
    :key="configFieldName"
  >
    <div class="config-content">
      <TextInputField
        v-if="
          props.componentDefinition?.configFields[configFieldName].type ===
          'text'
        "
        :field-settings="
          props.componentDefinition?.configFields[configFieldName]
        "
        :value="props.component?.config?.[configFieldName]!"
        @update:value="(value) => updateFieldValue(configFieldName, value)"
      />
      <SelectInputField
        v-if="
          props.componentDefinition?.configFields[configFieldName].type ===
          'select'
        "
        :field-settings="
          props.componentDefinition?.configFields[configFieldName]
        "
        :value="props.component?.config?.[configFieldName]!"
        @update:value="(value) => updateFieldValue(configFieldName, value)"
      />
    </div>
  </div>
</template>

<style scoped>
.config-content {
  margin-top: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
}
</style>