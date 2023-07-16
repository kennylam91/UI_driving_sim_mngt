<script lang="ts" setup>
import { login } from "@/services/user.service";
import { useAppStore } from "@/store/app";
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

const { setUser } = useAppStore();
const { push } = useRouter();
const formRef = ref<any>(null);
const snackbar = reactive({ show: false, text: "", timeout: 3000, color: "" });

const form = ref({
  username: "",
});

const onSubmit = async () => {
  if (formRef.value) {
    const { valid } = await formRef.value.validate();
    if (valid) {
      try {
        const response = await login(form.value);
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        push({ name: "Home" });
      } catch (error: any) {
        if (error.response?.data) {
          snackbar.text = error.response.data;
          snackbar.color = "error";
          snackbar.show = true;
        }
      }
    }
  }
};
</script>
<template>
  <div class="auth-wrapper pa-4 mx-auto" style="max-width: 500px">
    <VCard class="pa-4 pt-7">
      <VCardText class="text-center">
        <h5 class="text-h5 font-weight-semibold mb-2">
          Chào mừng bạn đến với luyenmophong.online 👋
        </h5>
        <span>
          Chúng tôi sẽ giúp bạn vượt qua bài thi mô phỏng lái xe bằng việc theo
          dõi và phân tích kết quả trong quá trình học của bạn.
        </span>
      </VCardText>
      <VCardText>
        <v-form ref="formRef" validate-on="blur" @submit.prevent="onSubmit">
          <VCol>
            <h6 class="text-h6">Nhập tài khoản để bắt đầu ngay</h6>
            <v-text-field
              v-model="form.username"
              label="Tài khoản"
              prepend-inner-icon="mdi-account"
              :rules="[
                (v) => !!v || 'Tài khoản không được để trống.',
                (value) =>
                  value.length >= 6 || 'Tài khoản cần tối thiểu 6 kí tự',
              ]"
            />
          </VCol>
          <VCol>
            <v-btn color="primary" block type="submit">
              Bắt đầu luyện tập
            </v-btn>
          </VCol>
        </v-form>
      </VCardText>
    </VCard>
    <v-snackbar
      v-model="snackbar.show"
      :timeout="snackbar.timeout"
      :color="snackbar.color"
    >
      {{ snackbar.text }}</v-snackbar
    >
  </div>
</template>
