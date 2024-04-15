<template>
  <div class="flex flex-col gap-1">
    <div v-if="typeRef !== 'checkbox'" class="flex justify-between items-center">
      <p class="whitespace-nowrap">{{ label }}:</p>
      <ToolTip v-if="tooltip" :text="tooltip" />
    </div>
    <div class="flex gap-1">
      <input
        v-model="modelValue"
        :type="typeRef"
        :disabled="disabled"
        class="border-2 border-black rounded-xl px-2 py-1 focus:border-black"
        :class="{ 'w-full' : typeRef !== 'checkbox', 'text-gray-600' : disabled}"
      />
      <label v-if="typeRef === 'checkbox'" class="pl-2">{{ label }}</label>
      <button v-if="type === 'password'" @click="typeRef = typeRef === 'text' ? 'password' : 'text'">
        <img
          :src="typeRef === 'text' ? eyeOpenIcon : eyeClosedIcon"
          alt="eye icon"
          class="w-6 h-6"
        />
      </button>
    </div>
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
import ToolTip from "./ToolTip.vue";
import eyeClosedIcon from "../../assets/icons/eye-closed.svg";
import eyeOpenIcon from "../../assets/icons/eye-outline.svg";
import { defineModel, ref } from "vue";

const props = withDefaults(
  defineProps<{
    type?: string;
    label: string;
    error?: string;
    tooltip?: string;
    disabled?: boolean;
  }>(),
  {
    type: "text",
  }
);

const typeRef = ref(props.type);

const modelValue = defineModel("modelValue");
</script>
