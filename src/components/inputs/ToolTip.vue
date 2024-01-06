<template>
  <div class="relative cursor-pointer" @mouseover="isOpen = true" @mouseleave="isOpen = false">
    <img :src="informationOutline" alt="informationOutline" />
    <div
      v-if="isOpen"
      class="absolute top-4 right-0 bg-white border border-black rounded-lg p-2">
      <p class="text-sm font-extralight">{{ text  }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import informationOutline from "../../assets/icons/information-outline.svg";
import { ref } from "vue";

defineProps<{
  text: string;
}>();

const isOpen = ref(false);
</script>
