<script lang="ts" setup>
import { useAppStore } from "@/store/app";
import { storeToRefs } from "pinia";
import { computed } from "vue";
const appStore = useAppStore();
const { totalAnswers, totalPoints, totalAnswerArr, totalPointArr } =
  storeToRefs(appStore);

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
                <span v-if="item.answers">{{ `(${item.answers} lần)` }}</span>
              </div>
            </div>
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
