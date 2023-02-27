<script setup lang="ts">
import { generateRandomExam } from "@/common/helpers";
import { ref, reactive, computed } from "vue";

const questions = generateRandomExam();
const answers = reactive(
  questions.map((q) => ({
    questionNo: q,
    point: null,
  }))
);

const reCreate = () => {
  const newQuestions = generateRandomExam();
  newQuestions.forEach((q, index) => {
    answers[index] = { questionNo: q, point: null };
  });
};

const totalPoint = ref(0);
const evaluate = computed(() => (totalPoint.value >= 35 ? "Đạt" : "Không Đạt"));
const showResult = ref(false);
const isSaveBtnDisabled = computed(
  () => showResult.value || answers.some((a) => a.point === null)
);
const save = () => {
  answers.forEach((ans) => (totalPoint.value += ans.point ?? 0));
  showResult.value = true;
};
</script>
<template>
  <VContainer>
    <span class="text-h6">Tạo bộ đề thi ngẫu nhiên</span>
    <VCard class="mt-3">
      <VCardText>
        <VForm :disabled="showResult">
          <VRow dense>
            <VCol v-for="answer in answers" :key="answer.questionNo" cols="6">
              <VSelect
                v-model="answer.point"
                :items="[5, 4, 3, 2, 1, 0]"
                :label="`Câu ${answer.questionNo}`"
                chips
              />
            </VCol>
          </VRow>
          <VRow dense>
            <VCol>
              <div class="form-action">
                <VBtn
                  color="primary"
                  :disabled="isSaveBtnDisabled"
                  @click="save"
                  >Lưu</VBtn
                >
                <VBtn class="ml-2" to="/">Hủy bỏ</VBtn>
                <VBtn color="success" class="ml-2" @click="reCreate">
                  Tạo mới
                </VBtn>
              </div>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>

    <VCard v-show="showResult" title="Kết quả" class="mt-3">
      <VCardText>
        <p>Tổng điểm: {{ totalPoint }}</p>
        <p>Đánh giá: {{ evaluate }}</p>
      </VCardText>
    </VCard>
  </VContainer>
</template>

<style scoped>
.form-action button {
  width: 90px;
}
</style>
