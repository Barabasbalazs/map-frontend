<template>
  <button
    class="border-2 border-black rounded-xl px-2 py-1 bg-black text-white"
    :class="{ 'cursor-not-allowed': disabled }"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  disabled?: boolean;
}>();
</script>
