<script setup lang="ts">
import {useAppStore} from "@/store/app";
import {storeToRefs} from "pinia";
import {reactive, watch} from "vue";

const appStore = useAppStore();
const {answersByQuestionMap, loading} = storeToRefs(appStore);

const minPointQuestions: any[] = reactive([null, null, null, null, null, null]);

watch(loading, (newVal) => {
  if (!newVal) {
    console.log("recalculate the recently mistakes");

    answersByQuestionMap.value.forEach((value, key) => {
      const found = minPointQuestions[value.part];
      if (
        !found ||
        (found !== null &&
          (Number(found.avg) > Number(value.avg) ||
            (Number(found.avg) === Number(value.avg) &&
              found.answers.length < value.answers.length)))
      ) {
        minPointQuestions[value.part] = value;
      }
    });
  }
});
</script>
<template>
  <VCard title="Tình huống cần cải thiện">
    <v-table density="compact" fixed-header height="260px">
      <thead>
      <tr>
        <th>Phần</th>
        <th>Tình huống</th>
        <th>Điểm</th>
        <th>TB</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(questionObj, index) in minPointQuestions" :key="index">
        <template v-if="questionObj">
          <td>{{ questionObj && questionObj.part + 1 }}</td>
          <td>{{ questionObj && questionObj.question }}</td>
          <td>{{ questionObj && questionObj.answers.join(", ") }}</td>
          <td>{{ questionObj && questionObj.avg }}</td>
        </template
        >
      </tr>
      </tbody>
    </v-table>
  </VCard>
  <!-- <VDialog>
    <VCard>
      <VToolbar
        density="compact"
        color="error"
        title="Luyện tập các tình huống xử lí kém nhất"
      >
        <VCardText> </VCardText>
      </VToolbar>
    </VCard>
  </VDialog> -->
</template>
