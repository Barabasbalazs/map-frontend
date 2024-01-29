<template>
  <div class="flex flex-col items-center gap-6">
    <div class="flex flex-col gap-2">
      <BaseInput
        v-model="interval"
        label="Interval between steps"
        type="number"
        tooltip="Seconds"
        :error="inputError"
      />
      <BaseButton :disabled="isBroadcasting" @click="startSendingProcess"
        >Send</BaseButton
      >
    </div>
    <div>
      <p>Number of points: {{ pathOfUser.length }}</p>
    </div>
    <div class="flex flex-col gap-2">
      <p v-for="(coordinate, ind) in pathOfUser" :key="ind">
        Latitude: {{ coordinate.lat }}, Longitude: {{ coordinate.lng }}
      </p>
    </div>
  </div>
  <BaseModal
    v-model:is-open="isModalOpen"
    title="Error"
    text="There was an error while trying to establish connection"
    warning
  />
</template>

<script setup lang="ts">
import BaseButton from "../shared/BaseButton.vue";
import BaseInput from "../shared/BaseInput.vue";
import BaseModal from "../shared/BaseModal.vue";
import { User } from "../../models/user-model";
import { Coordinates } from "../../types/coordinates";
import { ref, onBeforeUnmount, onMounted } from "vue";
import { useTransferSimulatedPath } from "../../composables/transfer-simulated-path";

const props = defineProps<{
  path: Coordinates[];
  user: User;
}>();

const emit = defineEmits<{
  (e: "finishedBroadcast"): void;
}>();

const isNoConnection = ref(true);

const pathOfUser = ref<Coordinates[]>(props.path);

const interval = ref<number>(1);

const {
  isModalOpen,
  inputError,
  isBroadcasting,
  startSendingProcess,
  socket,
  setupSocket,
} = useTransferSimulatedPath(props, emit, pathOfUser, interval, isNoConnection);

onMounted(() => setupSocket());

onBeforeUnmount(() => {
  if (isNoConnection.value) {
    return;
  }
  socket.value.disconnect();
});
</script>
