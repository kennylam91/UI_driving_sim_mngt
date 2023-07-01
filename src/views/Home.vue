<script lang="ts" setup>
import { useAppStore } from "@/store/app";
import AddAnswersCard from "@/components/AddAnswersCard.vue";
import OverviewCard from "@/components/OverviewCard.vue";
import MistakeCard from "@/components/MistakeCard.vue";
import AveragePointChart from "@/components/AveragePointChart.vue";
import { computed } from "vue";
import vuetify from "@/plugins/vuetify";

const appStore = useAppStore();
appStore.fetchAnswers();

const xs = computed(() => vuetify.display.xs.value);

const cols = computed(() => {
  return xs.value ? [12, 12] : [6, 6];
});
</script>
<template>
  <VContainer :loading="appStore.loading">
    <VRow>
      <VCol :cols="cols[0]">
        <OverviewCard />
        <AddAnswersCard class="mt-6" />
        <VCard title="Tạo một bộ đề thi ngẫu nhiên" class="mt-6">
          <VCardSubtitle>
            Bộ đề thi gồm 10 câu theo cấu trúc đề thi thật từ bộ GTVT.
          </VCardSubtitle>
          <VCardActions>
            <VBtn
              color="primary"
              variant="text"
              :to="{ name: 'CreateRandomExam' }"
            >
              Tạo ngay
            </VBtn>
          </VCardActions>
        </VCard>
      </VCol>
      <VCol :cols="cols[1]">
        <MistakeCard />

        <AveragePointChart class="mt-6" />
      </VCol>
    </VRow>
    <v-overlay
      v-model="appStore.loading"
      contained
      class="align-center justify-center"
    />
  </VContainer>
</template>
<style lang="scss"></style>
