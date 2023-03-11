<script setup lang="ts">
import {useAppStore} from "@/store/app";
import {storeToRefs} from "pinia";
import {computed, reactive, ref, watch} from "vue";
import {Answer} from "@/common/type";
import {addAnswers} from "@/services/answer.service";

const appStore = useAppStore();
const {loggedInUser, fetchAnswers} = appStore;
const {answersByQuestionMap, loading} = storeToRefs(appStore);

const minPointQuestions: any[] = reactive([null, null, null, null, null, null]);

watch(loading, (newVal) => {
  if (!newVal) {
    for (let i = 0; i < 6; i++) {
      minPointQuestions[i] = null;
    }

    answersByQuestionMap.value.forEach((value, key) => {
      const found = minPointQuestions[value.part];
      if (
        !found ||
        (found !== null &&
          (Number(found.avg) > Number(value.avg) ||
            (Number(found.avg) === Number(value.avg) &&
              found.answers.length < value.answers.length)))
      ) {
        minPointQuestions[value.part] = value;
      }
    });
  }
});

const practiceDialog = ref(false);
const answers = ref<Answer[]>([]);
const onPracticeClick = () => {
  practiceDialog.value = true;
  answers.value = minPointQuestions.map((item) => ({
    question: item.question,
    point: null,
    username: loggedInUser.username,
  }));
};
const isSaveBtnDisabled = computed(() => false);

const save = async () => {
  await addAnswers(answers.value.filter((item) => item.point !== null));
  practiceDialog.value = false;
  await fetchAnswers();
};
</script>
<template>
  <VCard title="Tình huống cần cải thiện">
    <v-table density="compact" fixed-header height="260px">
      <thead style="font-size: 14px;">
      <tr>
        <th>Phần</th>
        <th>TH</th>
        <th>Điểm</th>
        <th>TB</th>
      </tr>
      </thead>
      <tbody style="font-size: 14px;">
      <tr v-for="(questionObj, index) in minPointQuestions" :key="index">
        <template v-if="questionObj">
          <td>{{ questionObj && questionObj.part + 1 }}</td>
          <td>{{ questionObj && questionObj.question }}</td>
          <td>{{ questionObj && questionObj.answers.join(", ") }}</td>
          <td>{{ questionObj && questionObj.avg }}</td>
        </template>
      </tr>
      </tbody>
    </v-table>
    <v-divider></v-divider>
    <v-card-actions>
      <!--      <v-btn color="warning" variant="text"> Xem thêm</v-btn>-->
      <v-btn color="primary" variant="text" @click="onPracticeClick">
        Luyện tập ngay
      </v-btn>
    </v-card-actions>
    <VDialog v-model="practiceDialog" width="700px">
      <VCard>
        <VToolbar
          density="compact"
          color="warning"
          title="Luyện tập các tình huống sai"
        >
        </VToolbar>
        <VCardText>
          <VForm>
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
                  >
                    Lưu
                  </VBtn>
                  <v-btn
                    variant="plain"
                    class="ml-2"
                    @click="() => (practiceDialog = false)"
                  >Đóng
                  </v-btn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VDialog>
  </VCard>
</template>
