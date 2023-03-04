<script lang="ts" setup>
import { useAppStore } from "@/store/app";
import { computed } from "vue";
import AddAnswersCard from "@/components/AddAnswersCard.vue";
import OverviewCard from "@/components/OverviewCard.vue";
import MistakeCard from "@/components/MistakeCard.vue";

const appStore = useAppStore();
appStore.fetchAnswers();
</script>
<template>
  <VContainer :loading="appStore.loading">
    <OverviewCard />
    <MistakeCard class="mt-4" />

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
    <AddAnswersCard />
    <v-overlay
      v-model="appStore.loading"
      contained
      class="align-center justify-center"
    />
  </VContainer>
</template>
<style lang="scss"></style>
