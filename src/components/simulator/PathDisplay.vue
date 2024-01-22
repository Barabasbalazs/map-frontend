<template>
    <div class="flex flex-col items-center gap-6">
        <div class="flex flex-col gap-2">
            <BaseInput v-model="interval" label="Interval between steps" type="number" tooltip="Seconds" :error="inputError"/>
            <BaseButton :disabled="isBroadcasting" @click="startSendingProcess">Send</BaseButton>
        </div>
        <div>
            <p>Number of points: {{ pathOfUser.length }}</p>
        </div>
        <div class="flex flex-col gap-2">
           <p v-for="(coordinate, ind) in pathOfUser" :key="ind" >Latitude: {{ coordinate.lat }}, Longitude: {{ coordinate.lng }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import BaseButton from '../inputs/BaseButton.vue';
import BaseInput from '../inputs/BaseInput.vue';
import { User } from '../../models/user-model';
import { Coordinates } from '../../types/coordinates';
import configProvider from "../../config/config-provider";
import { io } from "socket.io-client";
import { useInterval } from "@vueuse/core";
import { onMounted, ref } from 'vue';

const props = defineProps<{
    path: Coordinates[];
    user: User;
}>();

const emit = defineEmits<{
    (e: "finishedBroadcast"): void,
}>();

const pathOfUser = ref<Coordinates[]>(props.path);

const interval = ref<number>(1);

const inputError = ref();

const socket = ref();

const isBroadcasting = ref(false);

function startSendingProcess() {
    if (interval.value <= 0) {
        inputError.value = "Interval must be greater than 0";
        return;
    }

    isBroadcasting.value = true;

    const { pause } = useInterval(interval.value * 1000, {
        callback: () => {
            if (props.path.length === 0) {
                socket.value.disconnect();
                pause();
                emit('finishedBroadcast');
            }
            socket.value.emit('update-location', [{
                id: props.user.id,
                name: props.user.name,
                coords: pathOfUser.value[0]
            }]);
            pathOfUser.value.shift();
        }, 
        controls: true
    });
}

onMounted(() => {
    socket.value = io(`${configProvider.wsServerUrl}/updates`);
});

</script>