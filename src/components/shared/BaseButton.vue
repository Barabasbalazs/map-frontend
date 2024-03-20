<template>
  <button
    class="border-2 border-black rounded-xl px-2 py-1 min-w-16"
    :class="{ 'cursor-not-allowed': disabled, 'bg-black text-white' : !secondary }"
    @click="disabled || emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  disabled?: boolean;
  secondary?: boolean;
}>();

const emit = defineEmits<{
  (e: "click"): void;
}>();
</script>
