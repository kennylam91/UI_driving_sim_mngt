<script setup lang="ts">
import { useTheme } from 'vuetify'
import { ref, computed } from 'vue'

const form = ref({
  email: '',
  password: '',
  remember: false,
})

const isPasswordVisible = ref(false)
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <v-card class="auth-card pa-4 pt-7" max-width="448">
      <v-card-item class="justify-center">
        <template #prepend>
          <div class="d-flex">
            <div />
          </div>
        </template>

        <v-card-title class="font-weight-semibold text-2xl text-uppercase">
          Materio
        </v-card-title>
      </v-card-item>

      <v-card-text class="pt-2">
        <h5 class="text-h5 font-weight-semibold mb-1">
          Welcome to Materio! 👋🏻
        </h5>
        <p class="mb-0">
          Please sign-in to your account and start the adventure
        </p>
      </v-card-text>

      <v-card-text>
        <v-form @submit.prevent="() => { }">
          <v-row>
            <!-- email -->
            <v-col cols="12">
              <v-text-field v-model="form.email" label="Email" type="email" />
            </v-col>

            <!-- password -->
            <v-col cols="12">
              <v-text-field v-model="form.password" label="Password" :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible" />

              <!-- remember me checkbox -->
              <div class="d-flex align-center justify-space-between flex-wrap mt-1 mb-4">
                <v-checkbox v-model="form.remember" label="Remember me" />

                <a class="ms-2 mb-1" href="javascript:void(0)">
                  Forgot Password?
              </a>
            </div>

              <!-- login button -->
              <v-btn block type="submit" to="/">
                Login
              </v-btn>
            </v-col>

            <!-- create account -->
            <v-col cols="12" class="text-center text-base">
              <span>New on our platform?</span>
              <!-- <router-link class="text-primary ms-2" :to="{ name: 'register' }">
                  Create an account
                </router-link> -->
            </v-col>

            <v-col cols="12" class="d-flex align-center">
              <v-divider />
              <span class="mx-4">or</span>
              <v-divider />
            </v-col>

          </v-row>
        </v-form>
      </v-card-text>
    </v-card>


    <!-- bg img -->
    <v-img class="auth-footer-mask d-none d-md-block" />
  </div>
</template>

<style lang="scss">
.auth-wrapper {
  min-block-size: calc(var(--vh, 1vh) * 100);
}

.auth-footer-mask {
  position: absolute;
  inset-block-end: 0;
  min-inline-size: 100%;
}

.auth-card {
  z-index: 1 !important;
}

.auth-footer-start-tree,
.auth-footer-end-tree {
  position: absolute;
  z-index: 1;
}

.auth-footer-start-tree {
  inset-block-end: 0;
  inset-inline-start: 0;
}

.auth-footer-end-tree {
  inset-block-end: 0;
  inset-inline-end: 0;
}

.auth-illustration {
  z-index: 1;
}

.auth-logo {
  position: absolute;
  z-index: 1;
  inset-block-start: 2rem;
  inset-inline-start: 2.3rem;
}

.auth-bg {
  background-color: rgb(var(--v-theme-surface));
}
</style>

