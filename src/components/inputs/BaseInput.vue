<template>
  <div class="flex flex-col gap-1">
    <div class="flex justify-between items-center">
      <p class="whitespace-nowrap">{{ label }}:</p>
      <ToolTip v-if="tooltip" :text="tooltip"/>
    </div>
    <input
      :type="type"
      class="border-2 border-black rounded-xl px-2 py-1 focus:border-black w-full"
    />
    <p v-if="error" class="text-red-600 whitespace-nowrap">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import ToolTip from "./ToolTip.vue";

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
</script>
