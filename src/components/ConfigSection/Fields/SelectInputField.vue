<script lang="ts" setup>
import { computed, ref } from "vue";
import Select from "primevue/select";
import FloatLabel from "primevue/floatlabel";
import Message from "primevue/message";
import type { ComponentConfigFieldWithExtraFields, ComponentConfigFieldSelectionOption } from "../../ComponentLibrary/components";

const props = withDefaults(
  defineProps<{
    fieldSettings: ComponentConfigFieldWithExtraFields<
      "select",
      string,
      {
        options: ComponentConfigFieldSelectionOption[];
      }
    >;
    value: string;
  }>(),
  {
    value: "",
  }
);

const emit = defineEmits<{
  "update:value": [value: string];
}>();

const hasError = ref(false);
const errorMessage = ref("");

// Validation function
const validateValue = (
  value: string | undefined | null
): { isValid: boolean; message: string } => {
  const safeValue = value || "";

  // Check if field is required (not nullable) and empty
  if (!props.fieldSettings.nullable && !safeValue) {
    return {
      isValid: false,
      message: `${props.fieldSettings.label || "This field"} is required`,
    };
  }

  // If nullable and empty value, that's valid
  if (props.fieldSettings.nullable && !safeValue) {
    return { isValid: true, message: "" };
  }

  // Check if the selected value is in the available options (only if not empty)
  if (safeValue) {
    const isValidOption = props.fieldSettings.options.some(
      option => option.value === safeValue
    );
    
    if (!isValidOption) {
      return {
        isValid: false,
        message: `Please select a valid option`,
      };
    }
  }

  return { isValid: true, message: "" };
};

const updateValue = (value: string | undefined) => {
  const newValue = value || "";
  const validation = validateValue(newValue);

  hasError.value = !validation.isValid;
  errorMessage.value = validation.message;

  // Only emit the value if validation passes
  if (validation.isValid) {
    emit("update:value", newValue);
  }
};

// Computed class for input styling based on validation state
const inputClass = computed(() => ({
  "w-full": true,
  "p-invalid": hasError.value,
}));

// Get the options for the select dropdown
const selectOptions = computed(() => {
  const baseOptions = props.fieldSettings.options || [];
  
  // If the field is nullable, add a "None" option at the beginning
  if (props.fieldSettings.nullable) {
    return [
      { label: "None", value: "" },
      ...baseOptions
    ];
  }
  
  return baseOptions;
});
</script>

<template>
  <div class="select-input-field">
    <FloatLabel>
      <Select
        :id="`select-input-${fieldSettings.label}`"
        :modelValue="value"
        @update:modelValue="updateValue"
        :options="selectOptions"
        optionLabel="label"
        optionValue="value"
        :class="inputClass"
      />
      <label :for="`select-input-${fieldSettings.label}`">
        {{ fieldSettings.label }}
        <span v-if="!fieldSettings.nullable" class="required-indicator">*</span>
      </label>
    </FloatLabel>

    <!-- Error message -->
    <Message v-if="hasError" severity="error" :closable="false" class="mt-2">
      {{ errorMessage }}
    </Message>
  </div>
</template>

<style scoped>
.select-input-field {
  margin-bottom: 1rem;
}

.required-indicator {
  color: #ef4444;
  margin-left: 0.25rem;
}

/* Ensure FloatLabel works properly */
:deep(.p-float-label) {
  width: 100%;
}

:deep(.p-select) {
  width: 100%;
}

/* Error message styling */
:deep(.p-message) {
  margin-top: 0.5rem;
  padding: 0.5rem;
}

:deep(.p-message .p-message-text) {
  font-size: 0.875rem;
}

/* Select dropdown styling */
:deep(.p-select .p-select-label) {
  width: 100%;
}
</style>
