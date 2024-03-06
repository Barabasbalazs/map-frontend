<template>
  <div class="flex flex-col w-screen mb-12">
    <div class="flex justify-center items-center md:py-24 py-12">
      <h1 class="text-4xl text-center">{{ title }}</h1>
    </div>
    <div class="flex justify-center">
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string;
  }>(),
  {
    title: "Balázs's Map App",
  }
);
</script>
