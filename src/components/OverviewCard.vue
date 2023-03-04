<script lang="ts" setup>
import { Answer } from "@/common/type";
import { useAppStore } from "@/store/app";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
const appStore = useAppStore();
const {
  totalAnswers,
  totalPoints,
  totalAnswerArr,
  totalPointArr,
  answersByPart,
} = storeToRefs(appStore);

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
      stats: totalAnswers,
      icon: "mdi-history",
      color: "primary",
    },
  ];
  for (let i = 1; i <= 6; i++) {
    arr.push({
      title: "Điểm TB phần " + i,
      stats: getAveragePoint(i - 1),
      answers: totalAnswerArr.value[i - 1],
      icon: `mdi-numeric-${i}-box`,
      color: "warning",
      part: i,
    });
  }

  return arr;
});

const getAveragePoint = (partIdx: number) => {
  return isNaN(totalPointArr.value[partIdx] / totalAnswerArr.value[partIdx])
    ? "---"
    : Number(
        totalPointArr.value[partIdx] / totalAnswerArr.value[partIdx]
      ).toFixed(2);
};

const historyDialog = ref(false);
const selectedPart = ref(null);
const selectedPartAnswers = computed(
  () => answersByPart.value[selectedPart.value?.part - 1]
);
const selectedPartGroupedAnswers = computed(() => {
  const groupedAnswers: any = {};
  selectedPartAnswers.value.forEach((answer: Answer) => {
    if (!groupedAnswers[answer.question]) {
      groupedAnswers[answer.question] = [Number(answer.point)];
    } else {
      groupedAnswers[answer.question].push(Number(answer.point));
    }
  });
  return groupedAnswers;
});
const viewHistory = (item: any) => {
  historyDialog.value = true;
  selectedPart.value = item;
};

const getAverage = (points: number[]) => {
  return (points.reduce((sum, val) => sum + val) / points.length).toFixed(1);
};
</script>
<template>
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
                <span
                  v-if="item.answers"
                  class="link text-info"
                  @click="viewHistory(item)"
                >
                  {{ `(${item.answers} lần)` }}</span
                >
              </div>
            </div>
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
  <VDialog v-model="historyDialog">
    <v-card>
      <v-toolbar
        density="compact"
        color="primary"
        :title="`Lịch sử phần ${selectedPart.part}`"
      ></v-toolbar>
      <v-card-text>
        <v-table density="compact" fixed-header height="60vh">
          <thead>
            <tr>
              <th>Câu hỏi</th>
              <th>Điểm</th>
              <th>TB</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(points, question) of selectedPartGroupedAnswers"
              :key="question"
            >
              <td>{{ question }}</td>
              <td>{{ points.join(", ") }}</td>
              <td>{{ getAverage(points) }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="() => (historyDialog = false)"
          >Close</v-btn
        >
      </v-card-actions>
    </v-card>
  </VDialog>
</template>
<style lang="scss">
.link {
  text-decoration: none;
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
