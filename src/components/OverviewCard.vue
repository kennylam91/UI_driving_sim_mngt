<script lang="ts" setup>
import { useAppStore } from "@/store/app";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

const appStore = useAppStore();
const { totalAnswers, totalAnswerArr, byQuestionMap, byPartMap } =
  storeToRefs(appStore);

const statistics = computed(() => {
  const arr: any[] = [
    {
      title: "Điểm TB",
      stats: allPartAvgPoint.value,
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
      title: "Phần " + i,
      stats: getAveragePoint(i),
      answers: totalAnswerArr.value[i - 1],
      icon: `mdi-numeric-${i}-box`,
      color: "warning",
      part: i,
    });
  }

  return arr;
});

const allPartAvgPoint = computed(() => {
  let sum = 0;
  let count = 0;
  byPartMap.value.forEach((value, key) => {
    const weight = [1, 3, 5, 6].includes(key) ? 2 : 1;
    sum += value.avg * weight;
    count += weight;
  });

  return count > 0 ? Number((sum / count).toFixed(1)) : "---";
});

const getAveragePoint = (part: number) => {
  return (byPartMap.value.get(part)?.avg || 0).toFixed(1);
};

const historyDialog = ref(false);
const selectedPart = ref<any>(null);
const questionList = computed(() => {
  const questionList: any[] = [];
  const partRangeMap = {
    1: [1, 29],
    2: [30, 43],
    3: [44, 63],
    4: [64, 73],
    5: [74, 90],
    6: [91, 120],
  };
  if (selectedPart.value?.part) {
    // @ts-ignored
    const partRange: number[] = partRangeMap[selectedPart.value.part];
    for (let i = partRange[0]; i <= partRange[1]; i++) {
      questionList.push({
        num: i,
        info: byQuestionMap.value.get(i),
      });
    }
  }
  return questionList;
});

const viewHistory = (item: any) => {
  historyDialog.value = true;
  selectedPart.value = item;
};
</script>
<template>
  <VCard title="Tổng quan">
    <VCardText class="mt-3">
      <VRow>
        <VCol
          v-for="item in statistics"
          :key="item.title"
          cols="6"
          sm="6"
          class="py-2"
        >
          <div class="d-flex align-center">
            <div class="me-2">
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
                  style="font-size: 16px"
                >
                  {{ item.stats }}
                </span>
                <span
                  v-if="item.answers"
                  class="link text-caption text-info"
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
        :title="`Thống kê các tình huống phần ${selectedPart.part}`"
      ></v-toolbar>
      <v-card-text class="pa-0">
        <v-table density="compact" fixed-header height="60vh">
          <thead>
            <tr>
              <th>STT</th>
              <th>Điểm</th>
              <th>TB</th>
              <!-- todo: add an icon to explain this -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="question in questionList" :key="question.num">
              <td>{{ question.num }}</td>
              <td>
                {{
                  (question.info.answers && question.info.answers.join(", ")) ||
                  "---"
                }}
              </td>
              <td>
                {{ question.info.avg }}
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="() => (historyDialog = false)">
          Đóng
        </v-btn>
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
