<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-[500] flex items-center justify-center h-screen w-screen bg-gray-200 bg-opacity-75"
    @click="isOpen = false"
  >
    <div
      class="bg-white border-2 border-black rounded-xl flex flex-col gap-2 items-center py-2 px-4 w-64"
      @click.stop
    >
      <h1 id="modal-title" class="text-xl" :class="{ 'text-red-600': warning }">
        {{ title }}
      </h1>
      <div
        v-if="text"
        id="modal-text"
        class="flex items-center justify-center text-center"
      >
        <p>{{ text }}</p>
      </div>
      <slot v-else />
      <div class="flex gap-2 pt-1">
        <BaseButton id="modal-confirmation-button" @click="confirmAction">{{
          buttonTexts && buttonTexts.length > 0 ? buttonTexts[0] : "Ok"
        }}</BaseButton>
        <BaseButton
          v-if="cancel"
          id="modal-cancel-button"
          secondary
          @click="cancelAction"
          >{{
            buttonTexts && buttonTexts.length > 1 ? buttonTexts[1] : "Cancel"
          }}</BaseButton
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from "./BaseButton.vue";
import { defineModel } from "vue";

const isOpen = defineModel("isOpen");

defineProps<{
  title: string;
  text?: string;
  warning?: boolean;
  cancel?: boolean;
  buttonTexts?: Array<string>;
}>();

const emit = defineEmits<{
  (e: "cancel"): void;
  (e: "confirm"): void;
}>();

function confirmAction() {
  emit("confirm");
  isOpen.value = false;
}

function cancelAction() {
  emit("cancel");
  isOpen.value = false;
}
</script>
