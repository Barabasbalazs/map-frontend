<template>
  <div class="border-2 border-black rounded-xl p-2 mx-4 max-w-md md:w-[28rem]">
    <div class="flex flex-col gap-2">
      <h3>Request to become Admin from {{ adminRequest.user.email }}</h3>
      <div class="flex items-center justify-center gap-2">
        <BaseButton id="approve-request" @click="respondToRequest(true)"
          >Approve</BaseButton
        >
        <BaseButton
          id="reject-request"
          secondary
          @click="respondToRequest(false)"
          >Reject</BaseButton
        >
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import BaseButton from "../shared/BaseButton.vue";
import { AdminRequest } from "../../models/admin-request";
import { useAdministrationStore } from "../../stores/administration-store";

const props = defineProps<{
  adminRequest: AdminRequest;
}>();

const administrationStore = useAdministrationStore();

async function respondToRequest(approved: boolean) {
  await administrationStore.respondToAdminRequest(
    props.adminRequest,
    approved
  );
}
</script>
