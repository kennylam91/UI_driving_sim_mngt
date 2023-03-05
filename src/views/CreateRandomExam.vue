<script setup lang="ts">
import {generateRandomExam} from "@/common/helpers";
import {Answer} from "@/common/type";
import {addAnswers} from "@/services/answer.service";
import {useAppStore} from "@/store/app";
import {computed, reactive, ref} from "vue";

const {loggedInUser} = useAppStore();
const questions = generateRandomExam();
const answers = reactive<Answer[]>(
  questions.map((q) => ({
    question: q,
    point: null,
    username: loggedInUser.username,
  }))
);

const reCreate = () => {
  const newQuestions = generateRandomExam();
  newQuestions.forEach((q, index) => {
    answers[index] = {
      question: q,
      point: "",
      username: loggedInUser.username,
    };
  });
};

const totalPoint = ref(0);
const evaluate = computed(() => (totalPoint.value >= 35 ? "Đạt" : "Không Đạt"));
const showResult = ref(false);
const isSaveBtnDisabled = computed(
  () => showResult.value || answers.some((a) => a.point === null)
);
const save = async () => {
  answers.forEach((ans) => (totalPoint.value += Number(ans.point) ?? 0));
  await addAnswers(answers);
  showResult.value = true;
};
</script>
<template>
  <VContainer>
    <p class="text-h6">Tạo bộ đề thi ngẫu nhiên</p>
    <span class="text-caption">
      Bộ đề thi sẽ được tạo ra ngẫu nhiên dựa theo cấu trúc đề thi thật của bộ GTVT.
    </span>
    <VCard class="mt-3">
      <VCardText>
        <VForm :disabled="showResult">
          <VRow dense>
            <VCol v-for="answer in answers" :key="answer.question" cols="6">
              <VSelect
                v-model="answer.point"
                :items="[5, 4, 3, 2, 1, 0]"
                :label="`Câu ${answer.question}`"
                chips
              />
            </VCol>
          </VRow>
          <VRow dense>
            <VCol>
              <div class="form-action">
                <VBtn
                  color="primary"
                  variant="elevated"
                  :disabled="isSaveBtnDisabled"
                  @click="save"
                >Lưu
                </VBtn>
                <VBtn color="warning" class="ml-2" @click="reCreate">
                  Tạo mới
                </VBtn>
                <v-btn variant="plain" class="ml-2" to="/">Hủy bỏ</v-btn>
              </div>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>

    <VDialog v-model="showResult">
      <VCard class="mt-3">
        <VToolbar density="compact" color="primary" title="Kết quả"/>
        <VCardText>
          <p>Tổng điểm: <strong>{{ totalPoint }}</strong></p>
          <p class="mt-3">Đánh giá:
            <span :class="[totalPoint >= 35 ? 'text-success' : 'text-error', 'font-weight-bold']">
            {{ evaluate }}
          </span>
          </p>
        </VCardText>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="() => (showResult = false)">
            Đóng
          </v-btn>
        </v-card-actions>
      </VCard>
    </VDialog>


  </VContainer>
</template>

<style scoped>
.form-action button {
  width: 90px;
}
</style>
