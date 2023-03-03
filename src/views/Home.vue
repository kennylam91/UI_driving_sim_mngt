<script lang="ts" setup>
import { getAnswers } from "@/services/answer.service";
import { useAppStore } from "@/store/app";
import { ref, computed, reactive } from "vue";
import { Answer } from "@/common/type";
import AddAnswersCard from "@/components/AddAnswersCard.vue";

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

const statistics = computed(() => {
  const arr: any[] = [
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
  ];
  for (let i = 1; i <= 6; i++) {
    arr.push({
      title: "Điểm TB phần " + i,
      stats: getAveragePoint(i - 1),
      answers: totalAnswerArr[i - 1],
      icon: `mdi-numeric-${i}-box`,
      color: "warning",
    });
  }

  return arr;
});
</script>
<template>
  <VContainer>
    <VCard title="Tổng quan">
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
                  <span v-if="item.answers">{{ `(${item.answers} lần)` }}</span>
                </div>
              </div>
            </div>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <AddAnswersCard @save="getAnswersAndCalculate" />

    <VCard title="Tạo một bộ đề thi ngẫu nhiên" class="mt-4">
      <VCardText>
        Hệ thống sẽ tạo ra một bộ đề thi ngẫu nhiên theo cấu trúc đề thi thật từ
        bộ GTVT.
      </VCardText>
      <VCardActions>
        <VBtn
          block
          color="primary"
          variant="tonal"
          :to="{ name: 'CreateRandomExam' }"
        >
          Tạo ngay
        </VBtn>
      </VCardActions>
    </VCard>
  </VContainer>
</template>
<style lang="scss"></style>
