<script lang="ts" setup>
import UserProfile from "./components/UserProfile.vue";
import { useRouter } from "vue-router";

const { push } = useRouter();

const backToHome = () => {
  push({ name: "Home" });
};
</script>
<template>
  <v-app-bar density="compact" color="primary">
    <v-app-bar-title> Luyện Mô Phỏng Online </v-app-bar-title>
    <!-- <v-spacer></v-spacer>
    <UserProfile class="mr-4"/> -->
  </v-app-bar>
</template>
