<script setup lang="ts">
import {Answer} from "@/common/type";
import {addAnswers} from "@/services/answer.service";
import {useAppStore} from "@/store/app";
import {ref} from "vue";

const {loggedInUser, fetchAnswers} = useAppStore();

const addAnswersDialog = ref(false);
const newAnswersStr = ref("");

const onAddAnswersClick = () => {
  newAnswersStr.value = "";
  addAnswersDialog.value = true;
};

const onAddAnswersSave = async () => {
  const answerList: Answer[] = [];
  if (newAnswersStr.value) {
    newAnswersStr.value
      .split(",")
      .map((item) => item.trim())
      .forEach((item) => {
        const splitArr = item.split(":").map((item) => item.trim());
        const question = Number(splitArr[0]);
        const point = Number(splitArr[1]);
        if (question > 0 && question <= 120 && point >= 0 && point <= 5) {
          answerList.push({
            username: loggedInUser.username as string,
            question: question,
            point: point,
          });
        }
      });
    await addAnswers(answerList);
    addAnswersDialog.value = false;
    await fetchAnswers();
  }
};
</script>
<template>
  <VCard title="Thêm điểm số nhanh" class="mt-4">
    <VCardText>
      Thêm nhanh điểm số của các câu hỏi đã luyện tập.
    </VCardText>
    <VCardActions>
      <VBtn block color="primary" variant="tonal" @click="onAddAnswersClick">
        Thêm điểm
      </VBtn>
    </VCardActions>
  </VCard>
  <v-dialog v-model="addAnswersDialog" width="auto" persistent>
    <v-card title="Thêm điểm số">
      <v-card-item>
        <span class="text-caption">
          Thêm điểm số mới bằng cách nhập vào ô dưới đây theo cấu trúc: 10:3,
          25:5 <br/>
          trong đó 10 là câu hỏi, 3 là điểm số tương ứng và các câu được ngăn
          cách bằng dấu phẩy.
        </span>
      </v-card-item>
      <v-card-text>
        <VTextarea
          variant="outlined"
          v-model="newAnswersStr"
          placeholder="10:3, 25:5"
        />
      </v-card-text>
      <v-card-actions class="justify-end">
        <VBtn color="primary" variant="tonal" @click="onAddAnswersSave"
        >Lưu
        </VBtn
        >
        <VBtn @click="addAnswersDialog = false">Hủy bỏ</VBtn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
