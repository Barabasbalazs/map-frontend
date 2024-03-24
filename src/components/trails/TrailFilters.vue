<template>
  <div class="border-2 border-black rounded-xl p-2 max-w-xl">
    <div class="grid grid-cols-2 gap-2">
      <BaseInput v-model="filters.search" id="search" label="Search" />
      <SelectInput
        v-model="filters.sort"
        id="sort"
        label="Sort"
        :options="['name', 'location', 'creator']"
      />
    </div>
    <div class="flex justify-center">
      <SelectInput
        class="w-1/4"
        v-model="filters.order"
        id="order"
        label="Order"
        :options="['asc', 'desc']"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import BaseInput from "../shared/BaseInput.vue";
import SelectInput from "../shared/SelectInput.vue";
import { User } from "../../models/user-model";
import { RequestParameters } from "../../types/request-parameter";
import { debouncedWatch } from "@vueuse/core";
import { ref } from "vue";

defineProps<{
  user: Partial<User>;
}>();

const emit = defineEmits<{
  search: [value: RequestParameters];
}>();

const filters = ref<RequestParameters>({
  sort: undefined,
  order: "asc",
  search: "",
});

debouncedWatch(
  () => [filters.value.sort, filters.value.order, filters.value.search],
  () => emit("search", filters.value),
  { debounce: 500 }
);
</script>
