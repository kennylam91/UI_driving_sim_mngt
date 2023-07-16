<script setup lang="ts">
import { useAppStore } from "@/store/app";
import { storeToRefs } from "pinia";
import { computed, reactive, ref, watch } from "vue";
import { Answer } from "@/common/type";
import { addAnswers } from "@/services/answer.service";

const appStore = useAppStore();
const { loggedInUser, fetchAnswers } = appStore;
const { loading, byQuestionMap } = storeToRefs(appStore);

const minPointQuestions = ref<any[]>([]);
const minPointQuestions1: any[] = reactive([
  null,
  null,
  null,
  null,
  null,
  null,
]);
const minPointQuestions2: any[] = reactive([
  null,
  null,
  null,
  null,
  null,
  null,
]);

watch(loading, (newVal) => {
  if (!newVal) {
    for (let i = 0; i < 6; i++) {
      minPointQuestions1[i] = null;
      minPointQuestions2[i] = null;
    }
    minPointQuestions.value = [];

    byQuestionMap.value.forEach((value, key) => {
      const found1 = minPointQuestions1[value.part - 1];
      const found2 = minPointQuestions2[value.part - 1];

      if (
        !found1 ||
        (found1 !== null &&
          (Number(found1.avg) > Number(value.avg) ||
            (Number(found1.avg) === Number(value.avg) &&
              found1.answers.length < value.answers.length)))
      ) {
        minPointQuestions1[value.part - 1] = value;
        if (!found2 || found1.avg < found2.avg) {
          minPointQuestions2[value.part - 1] = found1;
        }
        return;
      }

      if (
        !found2 ||
        (found2 !== null &&
          (Number(found2.avg) > Number(value.avg) ||
            (Number(found2.avg) === Number(value.avg) &&
              found2.answers.length < value.answers.length)))
      ) {
        minPointQuestions2[value.part - 1] = value;
      }
    });

    minPointQuestions1.forEach((q) => minPointQuestions.value.push(q));
    minPointQuestions.value.push(minPointQuestions2[0]);
    minPointQuestions.value.push(minPointQuestions2[2]);
    minPointQuestions.value.push(minPointQuestions2[4]);
    minPointQuestions.value.push(minPointQuestions2[5]);

    minPointQuestions.value.sort(
      (item1, item2) =>
        item1?.part - item2?.part + item1?.question - item2?.question
    );
  }
});

const practiceDialog = ref(false);
const answers = ref<Answer[]>([]);
const onPracticeClick = () => {
  practiceDialog.value = true;
  answers.value = minPointQuestions.value.map((item) => ({
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

const hasSomethingToPractice = computed(() =>
  minPointQuestions.value.some((item) => item)
);
</script>
<template>
  <VCard title="Tình huống cần cải thiện gần đây">
    <v-table
      v-if="hasSomethingToPractice"
      density="compact"
      fixed-header
      height="260px"
    >
      <thead style="font-size: 14px">
        <tr>
          <th>Phần</th>
          <th>TH</th>
          <th>Điểm</th>
          <th>TB</th>
        </tr>
      </thead>
      <tbody style="font-size: 14px">
        <tr
          v-for="(questionObj, index) in minPointQuestions.filter(
            (item) => item != null
          )"
          :key="index"
        >
          <td>{{ questionObj && questionObj.part }}</td>
          <td>{{ questionObj && questionObj.question }}</td>
          <td>
            {{ questionObj && questionObj.answers.slice(-3).join(", ") }}
          </td>
          <td>{{ questionObj && questionObj.avg }}</td>
        </tr>
      </tbody>
    </v-table>
    <VCardText v-else>
      Chưa có dữ liệu để hiển thị. Hãy bắt đầu luyện tập ngay.
    </VCardText>
    <v-divider></v-divider>
    <v-card-actions v-if="hasSomethingToPractice">
      <!--      <v-btn color="warning" variant="text"> Xem thêm</v-btn>-->
      <v-btn
        block
        color="warning"
        variant="elevated"
        @click="onPracticeClick"
        prepend-icon="mdi-weight-lifter"
      >
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
