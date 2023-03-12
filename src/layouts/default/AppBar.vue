<script lang="ts" setup>
import UserProfile from './components/UserProfile.vue';
import {useRouter} from "vue-router";

const {push} = useRouter()

const backToHome = () => {
  push({name: 'Home'})
}

</script>
<template>
  <v-app-bar flat>
    <v-app-bar-title style="cursor: pointer;" @click="backToHome">
      <img src="/logo.png" alt="SimuDrivePro logo" height="70" width="70" style="margin-bottom: -10px;"/>
    </v-app-bar-title>
    <v-spacer></v-spacer>
    <UserProfile class="mr-4"/>
  </v-app-bar>
</template>


