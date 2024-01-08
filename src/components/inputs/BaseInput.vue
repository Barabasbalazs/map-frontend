<template>
  <div class="flex flex-col gap-1">
    <div class="flex justify-between items-center">
      <p class="whitespace-nowrap">{{ label }}:</p>
      <ToolTip v-if="tooltip" :text="tooltip"/>
    </div>
    <input
      v-model="modelValue"
      :type="type"
      class="border-2 border-black rounded-xl px-2 py-1 focus:border-black w-full"/>
    <div class="min-h-5">
      <p v-if="error" class="text-red-600 text-sm md:whitespace-nowrap">{{ error }}</p>
    </div>  
  </div>
</template>

<script setup lang="ts">
import ToolTip from "./ToolTip.vue";
import { defineModel } from "vue";

withDefaults(
  defineProps<{
    type?: string;
    label: string;
    error?: string;
    tooltip?: string;
  }>(),
  {
    type: "text",
  }
);

const modelValue = defineModel('modelValue');
</script>
