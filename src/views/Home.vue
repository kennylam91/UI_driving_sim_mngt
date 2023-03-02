<script lang="ts" setup>
import { getAnswers, addAnswers } from "@/services/answer.service";
import { useAppStore } from "@/store/app";
import { ref, computed, reactive } from "vue";
import { Answer } from "@/common/type";

const { user }: { user: any } = useAppStore();
const answers = ref<Answer[]>([]);
const totalPointArr = reactive([0, 0, 0, 0, 0, 0]);
const totalAnswerArr = reactive([0, 0, 0, 0, 0, 0]);

const getAnswersAndCalculate = () => {
  if (user?.username) {
    getAnswers(user.username).then((response) => {
      answers.value = response.data;
      for (let i = 0; i < 6; i++) {
        totalPointArr[i] = 0;
        totalAnswerArr[i] = 0;
      }
      answers.value.forEach((answer) => {
        if (answer.question >= 91) {
          totalPointArr[5] += Number(answer.point);
          totalAnswerArr[5]++;
        } else if (answer.question >= 74) {
          totalPointArr[4] += Number(answer.point);
          totalAnswerArr[4]++;
        } else if (answer.question >= 64) {
          totalPointArr[3] += Number(answer.point);
          totalAnswerArr[3]++;
        } else if (answer.question >= 44) {
          totalPointArr[2] += Number(answer.point);
          totalAnswerArr[2]++;
        } else if (answer.question >= 30) {
          totalPointArr[1] += Number(answer.point);
          totalAnswerArr[1]++;
        } else {
          totalPointArr[0] += Number(answer.point);
          totalAnswerArr[0]++;
        }
      });
    });
  }
};

getAnswersAndCalculate();

const totalAnswers = computed(() => answers.value?.length);
const totalPoints = computed(() =>
  totalPointArr.reduce((prev, current) => prev + current)
);
const getAveragePoint = (partIdx: number) => {
  return isNaN(totalPointArr[partIdx] / totalAnswerArr[partIdx])
    ? "---"
    : Number(totalPointArr[partIdx] / totalAnswerArr[partIdx]).toFixed(2);
};

const statistics = computed(() => [
  {
    title: "diem_tb",
    stats:
      totalAnswers.value > 0
        ? Number(totalPoints.value / totalAnswers.value).toFixed(2)
        : "---",
    icon: "mdi-trophy",
    color: "success",
  },
  {
    title: "tong_so",
    stats: totalAnswers.value,
    icon: "mdi-history",
    color: "primary",
  },

  {
    title: "diem_tb_phan_1",
    stats: getAveragePoint(0),
    answers: totalAnswerArr[0],
    icon: "mdi-numeric-1-box",
    color: "warning",
  },
  {
    title: "diem_tb_phan_2",
    stats: getAveragePoint(1),
    answers: totalAnswerArr[1],
    icon: "mdi-numeric-2-box",
    color: "warning",
  },
  {
    title: "diem_tb_phan_3",
    stats: getAveragePoint(2),
    answers: totalAnswerArr[2],
    icon: "mdi-numeric-3-box",
    color: "warning",
  },
  {
    title: "diem_tb_phan_4",
    stats: getAveragePoint(3),
    answers: totalAnswerArr[3],
    icon: "mdi-numeric-4-box",
    color: "warning",
  },
  {
    title: "diem_tb_phan_5",
    stats: getAveragePoint(4),
    answers: totalAnswerArr[4],
    icon: "mdi-numeric-5-box",
    color: "warning",
  },
  {
    title: "diem_tb_phan_6",
    stats: getAveragePoint(5),
    answers: totalAnswerArr[5],
    icon: "mdi-numeric-6-box",
    color: "warning",
  },
]);

const addAnswersDialog = ref(false);
const newAnswersStr = ref("");
const onAddAnswersClick = () => {
  newAnswersStr.value = "";
  addAnswersDialog.value = true;
};
const onAddAnswersSave = async () => {
  const answerList: Answer[] = [];
  if (newAnswersStr.value) {
    newAnswersStr.value
      .split(",")
      .map((item) => item.trim())
      .forEach((item) => {
        const splitArr = item.split(":").map((item) => item.trim());
        answerList.push({
          username: user.username as string,
          question: splitArr[0],
          point: splitArr[1],
        });
      });
    await addAnswers(answerList);
    getAnswersAndCalculate();
    addAnswersDialog.value = false;
  }
};
</script>
<template>
  <VContainer>
    <VCard title="tong_quan">
      <VCardText>
        <VRow>
          <VCol v-for="item in statistics" :key="item.title" cols="6" sm="6">
            <div class="d-flex align-center">
              <div class="me-3">
                <VAvatar
                  :color="item.color"
                  rounded
                  size="42"
                  class="elevation-1"
                >
                  <VIcon size="24" :icon="item.icon" />
                </VAvatar>
              </div>

              <div class="d-flex flex-column">
                <span class="text-caption">
                  {{ item.title }}
                </span>
                <div>
                  <span
                    class="font-weight-medium d-inline-block mr-1"
                    style="font-size: 20px"
                  >
                    {{ item.stats }}
                  </span>
                  <span v-if="item.answers">{{ `(${item.answers} lan)` }}</span>
                </div>
              </div>
            </div>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <VCard title="add_answer_title" class="mt-4">
      <VCardText> add_answer_desc </VCardText>
      <VCardActions>
        <VBtn block color="primary" variant="tonal" @click="onAddAnswersClick">
          add_answers
        </VBtn>
      </VCardActions>
    </VCard>

    <VCard title="create_random_exam_title" class="mt-4">
      <VCardText> create_random_exam_desc </VCardText>
      <VCardActions>
        <VBtn
          block
          color="primary"
          variant="tonal"
          :to="{ name: 'CreateRandomExam' }"
        >
          create_now
        </VBtn>
      </VCardActions>
    </VCard>

    <v-dialog v-model="addAnswersDialog" width="auto" persistent>
      <v-card title="add_answers_title">
        <v-card-item>
          <span class="text-caption"> add_answers_desc </span>
        </v-card-item>
        <v-card-text>
          <VTextarea variant="outlined" v-model="newAnswersStr" />
        </v-card-text>
        <v-card-actions class="justify-end">
          <VBtn color="primary" variant="tonal" @click="onAddAnswersSave"
            >luu</VBtn
          >
          <VBtn @click="addAnswersDialog = false">huy</VBtn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </VContainer>
</template>
<style lang="scss"></style>
