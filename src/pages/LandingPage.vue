<template>
    <div>
        <h1>Landing Page</h1>
        <button @click="goToTrackingPage">Go to Tracking Page</button>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

function goToTrackingPage() {
    router.push("/tracking");
}

</script>