<template>
  <div class="border-2 border-black rounded-xl p-2 max-w-xl mx-4">
    <div class="grid grid-cols-2 gap-2">
      <BaseInput v-model="filters.search" id="search" label="Search" />
      <SelectInput
        v-model="filters.sort"
        id="sort"
        label="Sort"
        :options="['name', 'location', 'creator']"
      />
      <SelectInput
        v-model="filters.order"
        id="order"
        label="Order"
        :options="['asc', 'desc']"
      />
      <div class="flex items-center">
        <RouterLink id="my-trails-link" to="/my-trails" class="text-blue-700">My Trails</RouterLink>
      </div>
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
  sort: "name",
  order: "asc",
  search: "",
});

debouncedWatch(
  () => [filters.value.sort, filters.value.order, filters.value.search],
  () => emit("search", filters.value),
  { debounce: 500 }
);
</script>
