<script lang="ts" setup>
import type {
  Component,
  ComponentDefinition,
} from "../ComponentLibrary/components";
import { useContentStore } from "../stores/contentStore";
import TextInputField from "./Fields/TextInputField.vue";
import SelectInputField from "./Fields/SelectInputField.vue";
import TabManagementField from "./Fields/TabManagementField.vue";

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
  <br />
  <div class="config-field">
    <TextInputField
      :field-settings="{
        type: 'text',
        label: 'Internal Name',
        nullable: true,
        maxLength: 30,
        minLength: 3,
      }"
      :value="props.component?.internalName!"
      @update:value="(value) =>
            contentStore.updateComponentById(props.component?.id!, {
              internalName: value,
            })"
    />
  </div>
  <div
    v-for="configFieldName in Object.keys(
      props.componentDefinition?.configFields || {}
    )"
    :key="configFieldName"
  >
    <div class="config-field">
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
      <TabManagementField
        v-if="
          props.componentDefinition?.configFields[configFieldName].type ===
          'tabManager'
        "
        :component="props.component"
        :component-definition="props.componentDefinition"
      />
    </div>
  </div>
</template>

<style scoped>
.config-field {
  margin-top: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
}
</style>
