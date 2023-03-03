<script setup lang="ts">
import { login } from "@/services/user.service";
import { useAppStore } from "@/store/app";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

const form = ref({
  username: "",
  password: "",
});

const isPasswordVisible = ref(false);
const { push } = useRouter();
const snackbar = reactive({ show: false, text: "", timeout: 3000, color: "" });
const { setUser } = useAppStore();

const onLogin = async () => {
  try {
    const response = await login(form.value);
    setUser(response.data);
    localStorage.setItem("user", JSON.stringify(response.data));
    push({ name: "Home" });
  } catch (error: any) {
    console.error(error);
    snackbar.text = error.response.data;
    snackbar.color = "error";
    snackbar.show = true;
  }
};
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <v-card class="auth-card pa-4 pt-7" max-width="448">
      <v-card-text class="pt-2 text-center">
        <h5 class="text-h5 font-weight-semibold mb-1">
          Chào mừng đến với DSM ! 👋🏻
        </h5>
        <span>Ứng dụng giúp bạn theo dõi, phân tích quá trình học mô phỏng lái xe của mình.</span>
      </v-card-text>

      <v-card-text>
        <v-form @submit.prevent="onLogin" validate-on="blur">
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="form.username" label="Tài khoản"
                :rules="[(v) => !!v || 'Tài khoản là không được để trống.']" />
            </v-col>

            <v-col cols="12">
              <v-text-field v-model="form.password" label="Mật khẩu" :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="
                  isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
                " :rules="[(v) => !!v || 'Mật khẩu không được để trống.']"
                @click:append-inner="isPasswordVisible = !isPasswordVisible" />
            </v-col>
            <v-col cols="12">
              <v-btn block type="submit"> Đăng nhập </v-btn>
            </v-col>

            <!-- create account -->
            <v-col cols="12" class="text-center text-base">
              <span>Bạn chưa có tài khoản ?</span>
              <router-link class="text-primary ms-2" :to="{ name: 'Register' }">Tạo tạo khoản </router-link>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
    <v-snackbar v-model="snackbar.show" :timeout="snackbar.timeout" :color="snackbar.color">
      {{ snackbar.text }}</v-snackbar>
  </div>
</template>

<style lang="scss"></style>
