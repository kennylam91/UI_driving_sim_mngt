<script setup lang="ts">
import { computed, ref, reactive } from "vue";
import { register } from "@/services/user.service";
import { useRouter } from "vue-router";

const form = ref({
  username: "",
  email: "",
  password: "",
});
const snackbar = reactive({ show: false, text: "", timeout: 3000, color: "" });

const isPasswordVisible = ref(false);

const { push } = useRouter();
const registerUser = async () => {
  try {
    await register(form.value);
    snackbar.color = "success";
    snackbar.text = "Dang ki tai khoan thanh cong";
    snackbar.show = true;
    setTimeout(() => {
      push({ name: "Login" });
    }, 2000);
  } catch (err) {
    console.error(err);
  }
};
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <v-card class="auth-card pa-4 pt-7" max-width="448">
      <v-card-item class="justify-center">
        <v-card-title class="font-weight-semibold text-2xl text-uppercase">
          Materio
        </v-card-title>
      </v-card-item>

      <v-card-text>
        <v-form
          @submit.prevent="registerUser"
          ref="registerForm"
          validate-on="blur"
        >
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.username"
                label="Username"
                required
                :rules="[(v) => !!v || 'Username is required']"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.email"
                label="Email"
                type="email"
                required
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="form.password"
                label="Password"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="
                  isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
                "
                required
                :rules="[(v) => !!v || 'Password is required']"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />
            </v-col>
            <v-col cols="12">
              <v-btn
                block
                type="submit"
                :disabled="!form.username || !form.password"
                color="info"
              >
                Sign up
              </v-btn>
            </v-col>

            <!-- login instead -->
            <v-col cols="12" class="text-center text-base">
              <span>Already have an account?</span>
              <RouterLink class="text-primary ms-2" to="login">
                Sign in
              </RouterLink>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
    <v-snackbar
      v-model="snackbar.show"
      :timeout="snackbar.timeout"
      :color="snackbar.color"
    >
      {{ snackbar.text }}</v-snackbar
    >
  </div>
</template>

<style lang="scss"></style>
