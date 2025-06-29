<script lang="ts" setup>
import { computed, ref } from "vue";
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import Message from "primevue/message";
import type { ComponentConfigFieldWithExtraFields } from "../../ComponentLibrary/components";

const props = withDefaults(
  defineProps<{
    fieldSettings: ComponentConfigFieldWithExtraFields<
      string,
      {
        maxLength?: number;
        minLength?: number;
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
  const trimmedValue = safeValue.trim();

  // Check if field is required (not nullable) and empty
  if (!props.fieldSettings.nullable && !trimmedValue) {
    return {
      isValid: false,
      message: `${props.fieldSettings.label || "This field"} is required`,
    };
  }

  // Only validate length if value is not empty
  if (trimmedValue) {
    // Check minimum length
    if (
      props.fieldSettings.minLength &&
      trimmedValue.length < props.fieldSettings.minLength
    ) {
      return {
        isValid: false,
        message: `${
          props.fieldSettings.label || "This field"
        } must be at least ${props.fieldSettings.minLength} characters long`,
      };
    }

    // Check maximum length
    if (
      props.fieldSettings.maxLength &&
      trimmedValue.length > props.fieldSettings.maxLength
    ) {
      return {
        isValid: false,
        message: `${
          props.fieldSettings.label || "This field"
        } must not exceed ${props.fieldSettings.maxLength} characters`,
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

// Helper text for character count (when maxLength is set)
const characterCount = computed(() => {
  if (props.fieldSettings.maxLength) {
    const currentLength = props.value?.length || 0;
    return `${currentLength}/${props.fieldSettings.maxLength}`;
  }
  return null;
});
</script>

<template>
  <div class="text-input-field">
    <FloatLabel>
      <InputText
        :id="`text-input-${fieldSettings.label}`"
        :modelValue="value"
        @update:modelValue="updateValue"
        :class="inputClass"
        :maxlength="fieldSettings.maxLength"
      />
      <label :for="`text-input-${fieldSettings.label}`">
        {{ fieldSettings.label || "Text Input" }}
        <span v-if="!fieldSettings.nullable" class="required-indicator">*</span>
      </label>
    </FloatLabel>

    <!-- Error message -->
    <Message v-if="hasError" severity="error" :closable="false" class="mt-2">
      {{ errorMessage }}
    </Message>

    <!-- Character count (when maxLength is set) -->
    <div
      v-if="characterCount"
      class="character-count"
      :class="{
        'character-count-warning':
          (value?.length || 0) >= (fieldSettings.maxLength || 0) * 0.9,
      }"
    >
      {{ characterCount }}
    </div>
  </div>
</template>

<style scoped>
.text-input-field {
  margin-bottom: 1rem;
}

.required-indicator {
  color: #ef4444;
  margin-left: 0.25rem;
}

.character-count {
  font-size: 0.75rem;
  color: #6b7280;
  text-align: right;
  margin-top: 0.25rem;
}

.character-count-warning {
  color: #f59e0b;
  font-weight: 500;
}

/* Ensure FloatLabel works properly */
:deep(.p-float-label) {
  width: 100%;
}

:deep(.p-inputtext) {
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
</style>
