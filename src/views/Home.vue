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
    title: "Điểm TB",
    stats:
      totalAnswers.value > 0
        ? Number(totalPoints.value / totalAnswers.value).toFixed(2)
        : "---",
    icon: "mdi-trophy",
    color: "success",
  },
  {
    title: "Số câu đã làm",
    stats: totalAnswers.value,
    icon: "mdi-history",
    color: "primary",
  },

  {
    title: "Điểm TB phần 1",
    stats: getAveragePoint(0),
    answers: totalAnswerArr[0],
    icon: "mdi-numeric-1-box",
    color: "warning",
  },
  {
    title: "Điểm TB phần 2",
    stats: getAveragePoint(1),
    answers: totalAnswerArr[1],
    icon: "mdi-numeric-2-box",
    color: "warning",
  },
  {
    title: "Điểm TB phần 3",
    stats: getAveragePoint(2),
    answers: totalAnswerArr[2],
    icon: "mdi-numeric-3-box",
    color: "warning",
  },
  {
    title: "Điểm TB phần 4",
    stats: getAveragePoint(3),
    answers: totalAnswerArr[3],
    icon: "mdi-numeric-4-box",
    color: "warning",
  },
  {
    title: "Điểm TB phần 5",
    stats: getAveragePoint(4),
    answers: totalAnswerArr[4],
    icon: "mdi-numeric-5-box",
    color: "warning",
  },
  {
    title: "Điểm TB phần 6",
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
        const question = Number(splitArr[0]);
        const point = Number(splitArr[1]);
        if (question > 0 && question <= 120 && point >= 0 && point <= 5) {
          answerList.push({
            username: user.username as string,
            question: question,
            point: point,
          });
        }
      });
    await addAnswers(answerList);
    getAnswersAndCalculate();
    addAnswersDialog.value = false;
  }
};
</script>
<template>
  <VContainer>
    <VCard title="Tổng quan">
      <VCardText>
        <VRow>
          <VCol v-for="item in statistics" :key="item.title" cols="6" sm="6">
            <div class="d-flex align-center">
              <div class="me-3">
                <VAvatar :color="item.color" rounded size="42" class="elevation-1">
                  <VIcon size="24" :icon="item.icon" />
                </VAvatar>
              </div>

              <div class="d-flex flex-column">
                <span class="text-caption">
                  {{ item.title }}
                </span>
                <div>
                  <span class="font-weight-medium d-inline-block mr-1" style="font-size: 20px">
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

    <VCard title="Thêm điểm số" class="mt-4">
      <VCardText> Thêm ngay điểm số của các câu hỏi trong quá trình luyện tập. </VCardText>
      <VCardActions>
        <VBtn block color="primary" variant="tonal" @click="onAddAnswersClick">
          Thêm điểm
        </VBtn>
      </VCardActions>
    </VCard>

    <VCard title="Tạo một bộ đề thi ngẫu nhiên" class="mt-4">
      <VCardText> Hệ thống sẽ tạo ra một bộ đề thi ngẫu nhiên theo cấu trúc đề thi thật từ bộ GTVT. </VCardText>
      <VCardActions>
        <VBtn block color="primary" variant="tonal" :to="{ name: 'CreateRandomExam' }">
          Tạo ngay
        </VBtn>
      </VCardActions>
    </VCard>

    <v-dialog v-model="addAnswersDialog" width="auto" persistent>
      <v-card title="Thêm điểm số">
        <v-card-item>
          <span class="text-caption">
            Thêm điểm số mới bằng cách nhập vào ô dưới đây theo cấu trúc: 10:3, 25:5 <br /> trong đó 10 là câu hỏi,
            3 là điểm số tương ứng <br /> và các câu được ngăn cách bằng dấu phẩy.
          </span>
        </v-card-item>
        <v-card-text>
          <VTextarea variant="outlined" v-model="newAnswersStr" placeholder="10:3, 25:5" />
        </v-card-text>
        <v-card-actions class="justify-end">
          <VBtn color="primary" variant="tonal" @click="onAddAnswersSave">Lưu</VBtn>
          <VBtn @click="addAnswersDialog = false">Hủy bỏ</VBtn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </VContainer>
</template>
<style lang="scss"></style>
