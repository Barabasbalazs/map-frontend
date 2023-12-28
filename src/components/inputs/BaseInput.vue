<template>
  <div class="flex flex-col gap-1">
    <p>{{ label }}</p>
    <input
      :type="type"
      class="border-2 border-black rounded-xl px-2 py-1 focus:border-black w-full"
    />
    <p v-if="error" class="text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    type?: string;
    label: string;
    error?: string;
  }>(),
  {
    type: "text",
  }
);
</script>
