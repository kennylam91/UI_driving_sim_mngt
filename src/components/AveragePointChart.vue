<script setup lang="ts">
import { useAppStore } from "@/store/app";
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { computed } from "vue";

const appStore = useAppStore();
const { averagePointGroupByDay, loading } = storeToRefs(appStore);

const options = ref<any>({
  chart: {
    type: "line",
    zoom: { enabled: false },
    height: "100%",
    toolbar: { show: false },
  },
  xaxis: { categories: [] },
  yaxis: {},
  markers: {
    size: 1,
  },
});

const series = ref<any>([{ name: "Điểm TB", data: [] }]);

watch(loading, (newVal) => {
  if (!newVal) {
    options.value.xaxis.categories = [];
    series.value[0].data = [];
    for (const date in averagePointGroupByDay.value) {
      const { total, times } = averagePointGroupByDay.value[date];
      options.value.xaxis.categories.push(date);
      series.value[0].data.push((total / times).toFixed(1));
    }
  }
});

const hasChart = computed(() => averagePointGroupByDay.value);
</script>
<template>
  <VCard title="Kết quả luyện tập theo ngày">
    <div v-if="hasChart">
      <apexchart
        v-if="options.xaxis.categories.length"
        type="line"
        :options="options"
        :series="series"
      ></apexchart>
    </div>
    <VCardText v-else>
      Chưa có dữ liệu để hiển thị. Hãy bắt đầu luyện tập ngay.
    </VCardText>
  </VCard>
</template>
