<template>
  <PageLayout
    ><div class="flex flex-col gap-4 items-center">
        <!--Filter only on trails page-->
      <TrailFilters v-if="isTrailsPage" :user="user" @search="getTrails" />
      <Loader v-if="isLoading" />
      <!--Button and form only creatingpage-->
      <BaseButton
        v-if="isButtonVisible && !isTrailsPage"
        @click="isCreatingNewTrail = true"
        >Create New Trail</BaseButton
      >
      <TrailDisplay
        v-if="isCreatingNewTrail && !isTrailsPage"
        :trail="emptyTrail"
        :user="user"
        editable
        is-creating
        @delete="isCreatingNewTrail = false"
        @create="createTrail"
      />
      <template v-if="!isLoading">
        <TrailDisplay
          v-for="trail in trails"
          :key="trail.id"
          :trail="trail"
          :user="user"
          @delete="openDeleteModal"
        />
      </template></div
  ></PageLayout>
  <BaseModal
    v-model:is-open="isModalOpen"
    cancel
    warning
    @close="isModalOpen = false"
    title="Delete Trail"
    text="Are you sure you would like to delete this Trail? There may be users subscribed to it."
    @confirm="deleteTrail(!isTrailsPage)"
    @cancel="isModalOpen = false"
  />
</template>
<script setup lang="ts">
import PageLayout from "../components/shared/PageLayout.vue";
import Loader from "../components/shared/LoadingAnimation.vue";
import TrailFilters from "../components/trails/TrailFilters.vue";
import TrailDisplay from "../components/trails/TrailDisplay.vue";
import BaseButton from "../components/shared/BaseButton.vue";
import BaseModal from "../components/shared/BaseModal.vue";
import { useTrails } from "../composables/trails";

const {
  emptyTrail,
  isLoading,
  openDeleteModal,
  deleteTrail,
  isModalOpen,
  isCreatingNewTrail,
  user,
  trails,
  isButtonVisible,
  createTrail,
  isTrailsPage,
  getTrails
} = useTrails();
</script>
