<script setup lang="ts">
// import { useTheme } from 'vuetify'
import logo from '@/assets/logo.svg?raw'
// import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'

// import authV1MaskDark from '@/assets/images/pages/auth-v1-mask-dark.png'
// import authV1MaskLight from '@/assets/images/pages/auth-v1-mask-light.png'
// import authV1Tree2 from '@/assets/images/pages/auth-v1-tree-2.png'
// import authV1Tree from '@/assets/images/pages/auth-v1-tree.png'
import { computed, ref } from 'vue'

const form = ref({
  username: '',
  email: '',
  password: '',
  privacyPolicies: false,
})


const isPasswordVisible = ref(false)
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <v-card class="auth-card pa-4 pt-7" max-width="448">
      <v-card-item class="justify-center">
        <template #prepend>
          <!-- <div class="d-flex">
                <div v-html="logo" />
              </div> -->
        </template>

        <v-card-title class="font-weight-semibold text-2xl text-uppercase">
          Materio
        </v-card-title>
      </v-card-item>

      <v-card-text class="pt-2">
        <h5 class="text-h5 font-weight-semibold mb-1">
          Adventure starts here 🚀
        </h5>
        <p class="mb-0">
          Make your app management easy and fun!
        </p>
      </v-card-text>

      <v-card-text>
        <v-form @submit.prevent="() => { }">
          <v-row>
            <!-- Username -->
            <v-col cols="12">
              <v-text-field v-model="form.username" label="Username" />
            </v-col>
            <!-- email -->
            <v-col cols="12">
              <v-text-field v-model="form.email" label="Email" type="email" />
            </v-col>

            <!-- password -->
            <v-col cols="12">
              <v-text-field v-model="form.password" label="Password" :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible" />
              <div class="d-flex align-center mt-1 mb-4">
                <v-checkbox id="privacy-policy" v-model="form.privacyPolicies" inline />
                <v-label for="privacy-policy" style="opacity: 1;">
                  <span class="me-1">I agree to</span>
                  <a href="javascript:void(0)" class="text-primary">privacy policy & terms</a>
                </v-label>
              </div>

            <v-btn block type="submit">
                Sign up
              </v-btn>
            </v-col>

            <!-- login instead -->
            <v-col cols="12" class="text-center text-base">
            <span>Already have an account?</span>
            <RouterLink class="text-primary ms-2" to="login">
                Sign in instead
              </RouterLink>
          </v-col>

            <v-col cols="12" class="d-flex align-center">
              <v-divider />
              <span class="mx-4">or</span>
              <v-divider />
            </v-col>

            <!-- auth providers -->
            <!-- <v-col cols="12" class="text-center">
                            <AuthProvider />
                          </v-col> -->
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- <VImg class="auth-footer-start-tree d-none d-md-block" :src="authV1Tree" :width="250" />

                  <VImg :src="authV1Tree2" class="auth-footer-end-tree d-none d-md-block" :width="350" /> -->

    <!-- bg img
                  <VImg class="auth-footer-mask d-none d-md-block" :src="authThemeMask" /> -->
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


