<template>
  <button
    class="border-2 border-black rounded-xl px-2 py-1 bg-black text-white"
    :class="{ 'cursor-not-allowed': disabled }"
    @click="disabled || emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: "click"): void;
}>();
</script>
