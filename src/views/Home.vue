<script lang="ts" setup>
import { useAppStore } from "@/store/app";
import { computed } from "vue";
import AddAnswersCard from "@/components/AddAnswersCard.vue";
import OverviewCard from "@/components/OverviewCard.vue";

const { fetchAnswers } = useAppStore();
fetchAnswers();
</script>
<template>
  <VContainer>
    <OverviewCard />
    <AddAnswersCard />

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
