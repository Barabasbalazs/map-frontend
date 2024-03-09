<template>
  <div class="flex flex-col gap-1">
    <p class="whitespace-nowrap">{{ label }}:</p>
    <select
      v-model="modelValue"
      :disabled="disabled"
      class="border-2 border-black rounded-xl px-2 py-1 focus:border-black"
    >
      <option
        v-for="option in options"
        :key="option"
        :value="option"
        :selected="option === modelValue"
      >
        {{ capitalizeFirstLetter(option) }}
      </option>
    </select>
    <div class="min-h-5">
      <p
        v-if="error"
        id="error"
        class="text-red-600 text-sm md:whitespace-nowrap"
      >
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { capitalizeFirstLetter } from "../../utils/string-manipulation";
defineProps<{
  label: string;
  options: string[];
  disabled?: boolean;
  error?: string;
}>();

const modelValue = defineModel("modelValue");
</script>
