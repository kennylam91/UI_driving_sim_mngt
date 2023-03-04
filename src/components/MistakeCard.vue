<script setup lang="ts">
import { useAppStore } from "@/store/app";
import { storeToRefs } from "pinia";
import { reactive, watchEffect } from "vue";

const appStore = useAppStore();
const { answersByQuestionMap } = storeToRefs(appStore);

const minPointQuestions: any[] = reactive([null, null, null, null, null, null]);

watchEffect(() => {
  answersByQuestionMap.value.forEach((value, key) => {
    console.log("value", value);
    console.log("key", key);

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
});
</script>
<template>
  <VCard title="Tình huống cần cải thiện">
    <v-table density="compact" fixed-header height="300px">
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
            <td>{{ questionObj && questionObj.avg }}</td></template
          >
        </tr>
      </tbody>
    </v-table>
  </VCard>
</template>
