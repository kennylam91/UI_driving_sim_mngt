// Utilities
import { Answer } from "@/common/type";
import { getAnswers } from "@/services/answer.service";
import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";

export const useAppStore = defineStore("app", () => {

  const loggedInUser = ref(getUser())
  const setUser = (val: any) => { loggedInUser.value = val };

  const allAnswers = ref<Answer[]>()
  const totalAnswers = computed(() => allAnswers.value?.length || 0);
  const totalPoints = computed(() =>
    totalPointArr.reduce((prev, current) => prev + current)
  );
  const totalPointArr = reactive([0, 0, 0, 0, 0, 0]);
  const totalAnswerArr = reactive([0, 0, 0, 0, 0, 0]);
  const answersByPart = reactive<any>({ 0: [], 1: [], 2: [], 3: [], 4: [], 5: [] })

  const fetchAnswers = async () => {
    try {
      const res = await getAnswers(loggedInUser.value.username)
      allAnswers.value = res.data
      analyzeAnswers()
    } catch (error) {
      console.log(error);
    }
  }

  const analyzeAnswers = () => {
    for (let i = 0; i < 6; i++) {
      totalPointArr[i] = 0;
      totalAnswerArr[i] = 0;
      answersByPart[i] = []
    }
    allAnswers.value?.forEach((answer) => {
      if (answer.question >= 91) {
        totalPointArr[5] += Number(answer.point);
        totalAnswerArr[5]++;
        answersByPart[5].push(answer)
      } else if (answer.question >= 74) {
        totalPointArr[4] += Number(answer.point);
        totalAnswerArr[4]++;
        answersByPart[4].push(answer)
      } else if (answer.question >= 64) {
        totalPointArr[3] += Number(answer.point);
        totalAnswerArr[3]++;
        answersByPart[3].push(answer)
      } else if (answer.question >= 44) {
        totalPointArr[2] += Number(answer.point);
        totalAnswerArr[2]++;
        answersByPart[2].push(answer)
      } else if (answer.question >= 30) {
        totalPointArr[1] += Number(answer.point);
        totalAnswerArr[1]++;
        answersByPart[1].push(answer)
      } else {
        totalPointArr[0] += Number(answer.point);
        totalAnswerArr[0]++;
        answersByPart[0].push(answer)
      }
    });
  }

  return {
    loggedInUser, setUser, fetchAnswers, totalAnswers, totalPoints,
    totalAnswerArr, totalPointArr, answersByPart
  }
});


function getUser() {
  const savedUserStr = localStorage.getItem("user") || "";
  let savedUser: any = null;
  try {
    savedUser = JSON.parse(savedUserStr);
  } catch (err) {
    savedUser = null;
    console.log(err);

  }
  return savedUser;
}

